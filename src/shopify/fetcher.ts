import { graphqlClient } from './client.js';
import { PRODUCTS_QUERY } from './queries.js';
import type { GraphQLResponse, Product, FetchOptions } from '../types/product.types.js';

// Helper function to add delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch products with retry logic
async function fetchWithRetry(
  query: string,
  variables: { cursor: string | null; limit: number },
  maxRetries = 3
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await graphqlClient.request(query, {
        variables,
      });

      return response;
    } catch (error: any) {
      const isRateLimit = error.response?.status === 429 || error.message?.includes('429');

      if (isRateLimit) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`⚠️  Rate limit hit. Waiting ${delay}ms before retry ${attempt}/${maxRetries}...`);
        await sleep(delay);
      } else if (attempt === maxRetries) {
        console.error(`❌ Failed after ${maxRetries} attempts:`, error.message);
        throw error;
      } else {
        console.log(`⚠️  Error on attempt ${attempt}. Retrying...`);
        await sleep(1000);
      }
    }
  }

  throw new Error('Failed to fetch after all retries');
}

// Main function to fetch all products with pagination
export async function fetchAllProducts(options?: FetchOptions & { maxProducts?: number }): Promise<{
  products: Product[];
  totalCount: number;
}> {
  const products: Product[] = [];
  let hasNextPage = true;
  let cursor: string | null = options?.cursor || null;
  let pageCount = 0;
  const limit = options?.limit || 50;
  const maxProducts = options?.maxProducts; // Optional limit on total products

  console.log('🚀 Starting product fetch...');
  console.log(`📦 Batch size: ${limit} products per request`);
  if (maxProducts) {
    console.log(`🎯 Max products to fetch: ${maxProducts}`);
  }

  while (hasNextPage && (!maxProducts || products.length < maxProducts)) {
    try {
      // Execute GraphQL query with retry logic
      const response = await fetchWithRetry(
        PRODUCTS_QUERY,
        { cursor, limit },
        3
      );

      // Extract products from response
      const batch = response.data.products.edges.map((edge: any) => edge.node);
      products.push(...batch);

      // Update pagination state
      hasNextPage = response.data.products.pageInfo.hasNextPage;
      cursor = response.data.products.pageInfo.endCursor;
      pageCount++;

      // Log progress
      console.log(
        `✓ Fetched page ${pageCount}: ${batch.length} products (Total: ${products.length})`
      );

      // Respect rate limits - add delay between requests
      if (hasNextPage) {
        await sleep(500);
      }
    } catch (error: any) {
      console.error('❌ Error fetching products:', error.message);

      // If we have some products, return what we have
      if (products.length > 0) {
        console.log(`⚠️  Returning ${products.length} products fetched before error`);
        break;
      }

      throw error;
    }
  }

  console.log(`✅ Fetch complete! Total products: ${products.length}`);

  return {
    products,
    totalCount: products.length,
  };
}

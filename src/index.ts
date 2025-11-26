import express, { Request, Response } from 'express';
import { fetchAllProducts } from './shopify/fetcher.js';
import { transformProducts } from './utils/transformer.js';
import type { APIResponse } from './types/product.types.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main endpoint to fetch all products with metafields
app.get('/api/products', async (req: Request, res: Response) => {
  const startTime = Date.now();

  console.log('\n' + '='.repeat(60));
  console.log('📡 API Request: GET /api/products');
  console.log('='.repeat(60));

  try {
    // Fetch products from Shopify
    const rawData = await fetchAllProducts({
      cursor: req.query.cursor as string | undefined,
    });

    // Transform data to clean JSON structure
    console.log('🔄 Transforming data...');
    const products = transformProducts(rawData.products);

    // Calculate execution time
    const executionTime = ((Date.now() - startTime) / 1000).toFixed(1);

    // Build response
    const response: APIResponse = {
      success: true,
      data: {
        products,
        totalCount: products.length,
        hasNextPage: false,
        cursor: null,
      },
      metadata: {
        fetchedAt: new Date().toISOString(),
        executionTime: `${executionTime}s`,
      },
    };

    console.log('✅ Response ready!');
    console.log(`📊 Total products: ${products.length}`);
    console.log(`⏱️  Execution time: ${executionTime}s`);
    console.log('='.repeat(60) + '\n');

    // Send JSON response
    res.json(response);
  } catch (error: any) {
    console.error('❌ Error processing request:', error.message);
    console.error(error.stack);

    const response: APIResponse = {
      success: false,
      data: {
        products: [],
        totalCount: 0,
        hasNextPage: false,
        cursor: null,
      },
      metadata: {
        fetchedAt: new Date().toISOString(),
        executionTime: '0s',
      },
      error: error.message || 'Unknown error occurred',
    };

    res.status(500).json(response);
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '🚀'.repeat(30));
  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║        Shopify Product API Server Running!           ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);
  console.log(`  📍 Server URL:    http://localhost:${PORT}`);
  console.log(`  🏥 Health check:  http://localhost:${PORT}/health`);
  console.log(`  📦 Products API:  http://localhost:${PORT}/api/products`);
  console.log('\n' + '='.repeat(60));
  console.log('💡 Usage:');
  console.log(`  curl http://localhost:${PORT}/api/products`);
  console.log('='.repeat(60) + '\n');
  console.log('Ready to fetch product data with metafields! 🎉\n');
});

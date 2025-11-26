import type {
  Product,
  TransformedProduct,
  TransformedVariant,
  TransformedMetafields,
  MetafieldEdge,
} from '../types/product.types.js';

// Helper to extract numeric ID from Shopify GID
function extractId(gid: string): string {
  // Extracts "123" from "gid://shopify/Product/123"
  const parts = gid.split('/');
  return parts[parts.length - 1];
}

// Transform metafields from array of edges to key-value object
function transformMetafields(metafieldEdges: MetafieldEdge[]): TransformedMetafields {
  const result: TransformedMetafields = {};

  for (const edge of metafieldEdges) {
    const { namespace, key, value, type } = edge.node;
    const metafieldKey = `${namespace}.${key}`;

    // Try to parse JSON values
    if (type === 'json' || type === 'list.metaobject_reference') {
      try {
        result[metafieldKey] = JSON.parse(value);
      } catch {
        result[metafieldKey] = value;
      }
    } else {
      result[metafieldKey] = value;
    }
  }

  return result;
}

// Transform a single variant
function transformVariant(variant: any): TransformedVariant {
  return {
    id: extractId(variant.id),
    title: variant.title,
    sku: variant.sku,
    price: variant.price,
    inventoryQuantity: variant.inventoryQuantity,
    metafields: transformMetafields(variant.metafields.edges),
  };
}

// Transform a single product
function transformProduct(product: Product): TransformedProduct {
  return {
    id: extractId(product.id),
    title: product.title,
    handle: product.handle,
    status: product.status,
    productType: product.productType,
    vendor: product.vendor,
    tags: product.tags,
    images: product.images.edges.map(edge => ({
      id: extractId(edge.node.id),
      url: edge.node.url,
      altText: edge.node.altText,
      width: edge.node.width,
      height: edge.node.height,
    })),
    metafields: transformMetafields(product.metafields.edges),
    variants: product.variants.edges.map(edge => transformVariant(edge.node)),
  };
}

// Transform array of products
export function transformProducts(products: Product[]): TransformedProduct[] {
  return products.map(transformProduct);
}

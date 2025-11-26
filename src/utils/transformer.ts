import type {
  Product,
  TransformedProduct,
  TransformedVariant,
  TransformedMetafields,
  MetafieldEdge,
} from '../types/product.types.js';

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
    id: variant.id,
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
    id: product.id,
    title: product.title,
    handle: product.handle,
    status: product.status,
    productType: product.productType,
    vendor: product.vendor,
    tags: product.tags,
    metafields: transformMetafields(product.metafields.edges),
    variants: product.variants.edges.map(edge => transformVariant(edge.node)),
  };
}

// Transform array of products
export function transformProducts(products: Product[]): TransformedProduct[] {
  return products.map(transformProduct);
}

export interface Metafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface MetafieldEdge {
  node: Metafield;
}

export interface Variant {
  id: string;
  title: string;
  sku: string | null;
  price: string;
  inventoryQuantity: number;
  metafields: {
    edges: MetafieldEdge[];
  };
}

export interface VariantEdge {
  node: Variant;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  status: string;
  productType: string;
  vendor: string;
  tags: string[];
  metafields: {
    edges: MetafieldEdge[];
  };
  variants: {
    edges: VariantEdge[];
  };
}

export interface ProductEdge {
  node: Product;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface ProductsResponse {
  products: {
    edges: ProductEdge[];
    pageInfo: PageInfo;
  };
}

export interface GraphQLResponse {
  body: {
    data: ProductsResponse;
  };
}

export interface TransformedMetafields {
  [key: string]: string;
}

export interface TransformedVariant {
  id: string;
  title: string;
  sku: string | null;
  price: string;
  inventoryQuantity: number;
  metafields: TransformedMetafields;
}

export interface TransformedProduct {
  id: string;
  title: string;
  handle: string;
  status: string;
  productType: string;
  vendor: string;
  tags: string[];
  metafields: TransformedMetafields;
  variants: TransformedVariant[];
}

export interface FetchOptions {
  cursor?: string;
  limit?: number;
  maxProducts?: number;
}

export interface APIResponse {
  success: boolean;
  data: {
    products: TransformedProduct[];
    totalCount: number;
    hasNextPage: boolean;
    cursor: string | null;
  };
  metadata: {
    fetchedAt: string;
    executionTime: string;
  };
  error?: string;
}

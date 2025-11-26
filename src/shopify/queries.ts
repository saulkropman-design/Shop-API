// GraphQL query to fetch products with all metafields
// This query fetches products with pagination, including:
// - All product fields (id, title, handle, etc.)
// - All product metafields (up to 100)
// - All variants with their metafields (up to 100 variants, each with up to 100 metafields)

export const PRODUCTS_QUERY = `
  query GetProducts($cursor: String, $limit: Int!) {
    products(first: $limit, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          status
          productType
          vendor
          tags
          metafields(first: 100) {
            edges {
              node {
                namespace
                key
                value
                type
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                sku
                price
                inventoryQuantity
                metafields(first: 100) {
                  edges {
                    node {
                      namespace
                      key
                      value
                      type
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Test query to fetch just a few products (for testing)
export const PRODUCTS_TEST_QUERY = `
  query GetProductsTest {
    products(first: 5) {
      edges {
        node {
          id
          title
          handle
          metafields(first: 10) {
            edges {
              node {
                namespace
                key
                value
                type
              }
            }
          }
          variants(first: 5) {
            edges {
              node {
                id
                title
                sku
                metafields(first: 10) {
                  edges {
                    node {
                      namespace
                      key
                      value
                      type
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

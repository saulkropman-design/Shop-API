# Shopify Product Data Extraction API

A private Shopify app that exposes an API endpoint to fetch all product data including metafields via GraphQL. Data is returned as JSON directly in the HTTP response for consumption by AI chatbot tools.

## Features

- Fetches **all products** with **all metafields** (product and variant level)
- Uses **GraphQL** for efficient data fetching (avoids REST API rate limits)
- **Cursor-based pagination** handles stores with 50-50,000+ products
- Returns **clean JSON** optimized for AI/chatbot consumption
- **Automatic retry logic** with exponential backoff
- **No file operations** - data flows directly via HTTP

## Prerequisites

- Shopify Admin API access token (from custom app)
- Shopify store URL
- Railway account (for cloud deployment) OR Node.js 18+ (for local)

## Deployment Options

### ⭐ Option 1: Deploy to Railway (Recommended)

**Deploy to the cloud** - no need to run locally! Railway provides:
- ✅ No timeout limits (handles stores with 50k products)
- ✅ Free tier with 500 hours/month
- ✅ Automatic HTTPS
- ✅ Always-on hosting

**📖 Complete guide**: [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)

**Quick Deploy:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Set environment variables in Railway dashboard
```

Your API will be live at: `https://your-app.up.railway.app/api/products`

### Option 2: Run Locally (Testing Only)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:

   Update your `.env` file with your Shopify credentials:
   ```env
   SHOP_URL=your-store.myshopify.com
   ADMIN_API_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   PORT=3000
   API_KEY=your-optional-secret-key
   ```

## Usage

### Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

### API Endpoints

#### 1. Fetch All Products
```bash
GET http://localhost:3000/api/products
```

**Example request**:
```bash
curl http://localhost:3000/api/products
```

**Response format**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "gid://shopify/Product/1234567890",
        "title": "Awesome T-Shirt",
        "handle": "awesome-t-shirt",
        "status": "ACTIVE",
        "productType": "Apparel",
        "vendor": "Cool Brand",
        "tags": ["summer", "sale"],
        "metafields": {
          "custom.material": "100% Cotton",
          "custom.care_instructions": "Machine wash cold",
          "seo.hidden": "0"
        },
        "variants": [
          {
            "id": "gid://shopify/ProductVariant/9876543210",
            "title": "Small / Blue",
            "sku": "AWSM-TSH-S-BLU",
            "price": "29.99",
            "inventoryQuantity": 15,
            "metafields": {
              "custom.barcode": "123456789012"
            }
          }
        ]
      }
    ],
    "totalCount": 1250,
    "hasNextPage": false,
    "cursor": null
  },
  "metadata": {
    "fetchedAt": "2025-11-26T10:30:00Z",
    "executionTime": "45.2s"
  }
}
```

#### 2. Health Check
```bash
GET http://localhost:3000/health
```

Returns server status.

### Integration with AI Chatbot

Your AI chatbot tool should make HTTP GET requests to the API endpoint:

**JavaScript/Node.js**:
```javascript
const response = await fetch('http://localhost:3000/api/products');
const data = await response.json();
const products = data.data.products;
```

**Python**:
```python
import requests

response = requests.get('http://localhost:3000/api/products')
products = response.json()['data']['products']
```

**cURL (save to file for testing)**:
```bash
curl http://localhost:3000/api/products > products.json
```

## How It Works

1. **GraphQL Efficiency**: Fetches products with metafields in a single query (vs REST requiring separate calls per product)
2. **Pagination**: Automatically handles cursor-based pagination for large stores
3. **Rate Limiting**: Built-in retry logic with exponential backoff
4. **Data Transformation**: Converts nested GraphQL structure to flat, AI-friendly JSON
5. **Metafield Format**: Metafields are returned as `"namespace.key": "value"` for easy parsing

## Performance

- **Small stores** (<1,000 products): 10-30 seconds
- **Medium stores** (1,000-10,000 products): 1-5 minutes
- **Large stores** (10,000-50,000 products): 30-45 minutes

## Project Structure

```
Shop API/
├── .env                          # Environment variables
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── src/
│   ├── index.ts                  # Express server
│   ├── shopify/
│   │   ├── client.ts             # Shopify API client
│   │   ├── queries.ts            # GraphQL queries
│   │   └── fetcher.ts            # Pagination logic
│   ├── types/
│   │   └── product.types.ts      # TypeScript types
│   └── utils/
│       └── transformer.ts        # Data transformation
└── README.md
```

## Troubleshooting

### "Missing required environment variables"
- Ensure `.env` file exists and contains `SHOP_URL` and `ADMIN_API_ACCESS_TOKEN`
- Remove `https://` from `SHOP_URL` (use `your-store.myshopify.com`)

### "Rate limit hit"
- The app automatically retries with exponential backoff
- For very large stores, this is normal and will resolve automatically

### "No metafields in response"
- Check that your products actually have metafields in Shopify admin
- Verify the Admin API access token has `read_products` scope

### Empty products array
- Verify your store has products
- Check the API access token permissions
- Review the console logs for error messages

## API Access Token Setup

To create a private Shopify app and get an Admin API access token:

1. Go to Shopify Admin → Settings → Apps and sales channels
2. Click "Develop apps"
3. Create a new app
4. Configure Admin API scopes: `read_products`, `read_product_listings`
5. Install the app to your store
6. Copy the Admin API access token to `.env`

## License

MIT

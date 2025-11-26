# Quick Start Guide

## 🚀 Get Your API Running in 10 Minutes

### Step 1: Get Shopify Credentials (5 min)

1. Go to your **Shopify Admin** → **Settings** → **Apps and sales channels**
2. Click **"Develop apps"** → **"Create an app"**
3. Name: "Product Data Exporter" → **Create app**
4. Click **"Configure Admin API scopes"**
5. Enable: `read_products` and `read_product_listings` → **Save**
6. Click **"Install app"** → Confirm
7. Go to **"API credentials"** → Reveal and **copy the Admin API access token**

**You now have:**
- ✅ `SHOP_URL`: your-store.myshopify.com
- ✅ `ADMIN_API_ACCESS_TOKEN`: shpat_xxxxx...

---

### Step 2: Deploy to Railway (5 min)

#### Method A: Deploy from GitHub (Easier)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Shopify API"
git remote add origin https://github.com/YOUR_USERNAME/shopify-api.git
git push -u origin main

# 2. Go to https://railway.app
# 3. Sign in with GitHub
# 4. Click "New Project" → "Deploy from GitHub repo"
# 5. Select your repository
```

#### Method B: Deploy via CLI (Faster)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
railway init  # Create new project
railway up    # Deploy

# 3. Set environment variables
railway variables set SHOP_URL=your-store.myshopify.com
railway variables set ADMIN_API_ACCESS_TOKEN=shpat_xxxxx
railway variables set PORT=3000
railway variables set API_KEY=make-up-a-secret-key

# 4. Generate a public domain
railway domain
```

---

### Step 3: Test Your API

```bash
# Get your Railway URL from the dashboard or CLI
# It will look like: https://shopify-product-api-production.up.railway.app

# Test health check
curl https://your-app.up.railway.app/health

# Fetch products (with API key)
curl -H "x-api-key: your-secret-key" https://your-app.up.railway.app/api/products
```

**Success!** You should see JSON with all your products and metafields.

---

## 🤖 Connect to Your AI Chatbot

Your chatbot should make HTTP requests to:

**Endpoint:** `https://your-app.up.railway.app/api/products`

**JavaScript:**
```javascript
const response = await fetch('https://your-app.up.railway.app/api/products', {
  headers: { 'x-api-key': 'your-secret-key' }
});
const data = await response.json();
const products = data.data.products;
```

**Python:**
```python
import requests
headers = {'x-api-key': 'your-secret-key'}
response = requests.get('https://your-app.up.railway.app/api/products', headers=headers)
products = response.json()['data']['products']
```

---

## 📊 What the API Returns

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "gid://shopify/Product/123",
        "title": "Cool Product",
        "handle": "cool-product",
        "productType": "Apparel",
        "vendor": "Your Brand",
        "tags": ["summer", "sale"],
        "metafields": {
          "custom.material": "Cotton",
          "custom.care": "Machine wash"
        },
        "variants": [
          {
            "id": "gid://shopify/ProductVariant/456",
            "title": "Small",
            "sku": "COOL-S",
            "price": "29.99",
            "inventoryQuantity": 10,
            "metafields": {
              "custom.barcode": "123456"
            }
          }
        ]
      }
    ],
    "totalCount": 1250
  },
  "metadata": {
    "fetchedAt": "2025-11-26T10:00:00Z",
    "executionTime": "12.5s"
  }
}
```

---

## ⚙️ Environment Variables

Set these in Railway dashboard:

| Variable | Example | Required |
|----------|---------|----------|
| `SHOP_URL` | `mystore.myshopify.com` | ✅ Yes |
| `ADMIN_API_ACCESS_TOKEN` | `shpat_xxxxx` | ✅ Yes |
| `PORT` | `3000` | ✅ Yes |
| `API_KEY` | `my-secret-key-123` | Optional (but recommended) |

---

## 🔍 Troubleshooting

**"Unauthorized" error:**
- Check your `x-api-key` header matches your `API_KEY` env variable
- Or remove `API_KEY` from Railway if you don't want authentication

**No metafields in response:**
- Check your products actually have metafields in Shopify
- Verify API token has `read_products` scope

**Timeout for large stores:**
- Normal for 10k+ products (can take 30-45 min)
- Railway has no timeout limits, so it will complete
- Your chatbot needs to handle long requests

**View logs:**
```bash
railway logs
```

Or check the Railway dashboard → Deployments → Logs

---

## 📚 Full Documentation

- **Railway Deployment**: [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)
- **Complete README**: [README.md](README.md)

---

## ✅ Checklist

- [ ] Created Shopify custom app
- [ ] Got Admin API access token
- [ ] Deployed to Railway
- [ ] Set environment variables
- [ ] Generated Railway domain
- [ ] Tested `/health` endpoint
- [ ] Tested `/api/products` endpoint
- [ ] Connected to AI chatbot

**You're all set! 🎉**

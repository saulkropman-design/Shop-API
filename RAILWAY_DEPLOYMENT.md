# Railway Deployment Guide

This guide will walk you through deploying your Shopify Product API to Railway.app.

## Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- GitHub account (optional but recommended)
- Your Shopify Admin API credentials

## Deployment Methods

### Method 1: Deploy from GitHub (Recommended)

This method provides automatic deployments when you push code changes.

#### Step 1: Push Code to GitHub

```bash
# Navigate to your project
cd "/Users/saulkropman/Downloads/Shop API"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Shopify Product API"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/shopify-product-api.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy on Railway

1. **Go to Railway**: https://railway.app
2. **Sign in** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**: `shopify-product-api`
6. **Railway will automatically detect** it's a Node.js app and start deploying

#### Step 3: Configure Environment Variables

1. In your Railway project, click on your service
2. Go to the **"Variables"** tab
3. Add these environment variables:

```
SHOP_URL=your-store.myshopify.com
ADMIN_API_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3000
API_KEY=your-secret-api-key-here
```

**Important:**
- `SHOP_URL`: Your Shopify store URL (without https://)
- `ADMIN_API_ACCESS_TOKEN`: From your Shopify custom app
- `PORT`: Set to 3000 (Railway will use this)
- `API_KEY`: (Optional) A secret key for authentication - make it random and strong

#### Step 4: Get Your API URL

1. Go to the **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. You'll get a URL like: `https://shopify-product-api-production.up.railway.app`

Your API endpoint will be:
```
https://your-app.up.railway.app/api/products
```

### Method 2: Deploy via Railway CLI

If you prefer command line deployment:

#### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

#### Step 2: Login to Railway

```bash
railway login
```

This will open your browser for authentication.

#### Step 3: Initialize Project

```bash
cd "/Users/saulkropman/Downloads/Shop API"
railway init
```

Select "Create a new project" and name it (e.g., "shopify-product-api")

#### Step 4: Add Environment Variables

```bash
railway variables set SHOP_URL=your-store.myshopify.com
railway variables set ADMIN_API_ACCESS_TOKEN=shpat_xxxxxx
railway variables set PORT=3000
railway variables set API_KEY=your-secret-key
```

#### Step 5: Deploy

```bash
railway up
```

#### Step 6: Get Your Domain

```bash
railway domain
```

Or add a domain via the dashboard.

## Testing Your Deployment

### 1. Health Check

```bash
curl https://your-app.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-26T10:30:00.000Z"
}
```

### 2. Fetch Products (without API key)

If you didn't set an `API_KEY`:
```bash
curl https://your-app.up.railway.app/api/products
```

### 3. Fetch Products (with API key)

If you set an `API_KEY`:
```bash
curl -H "x-api-key: your-secret-key" https://your-app.up.railway.app/api/products
```

## Getting Shopify Custom App Credentials

If you haven't created your Shopify custom app yet:

### Step 1: Create Custom App

1. Go to **Shopify Admin** → **Settings** → **Apps and sales channels**
2. Click **"Develop apps"** (top right)
3. Click **"Create an app"**
4. Name it: "Product Data Exporter"
5. Click **"Create app"**

### Step 2: Configure API Scopes

1. Click **"Configure Admin API scopes"**
2. Enable these scopes:
   - ✅ `read_products`
   - ✅ `read_product_listings`
3. Click **"Save"**

### Step 3: Install App

1. Click **"Install app"**
2. Confirm the installation

### Step 4: Get Access Token

1. Click **"API credentials"** tab
2. Under **"Admin API access token"**, click **"Reveal token once"**
3. **Copy the token** (starts with `shpat_`)
4. **Save it securely** - you can't view it again!

## Using Your API

### From JavaScript/Node.js

```javascript
// Without API key
const response = await fetch('https://your-app.up.railway.app/api/products');
const data = await response.json();
console.log(data.data.products);

// With API key
const response = await fetch('https://your-app.up.railway.app/api/products', {
  headers: {
    'x-api-key': 'your-secret-key'
  }
});
const data = await response.json();
console.log(data.data.products);
```

### From Python

```python
import requests

# Without API key
response = requests.get('https://your-app.up.railway.app/api/products')
products = response.json()['data']['products']

# With API key
headers = {'x-api-key': 'your-secret-key'}
response = requests.get('https://your-app.up.railway.app/api/products', headers=headers)
products = response.json()['data']['products']
```

### From cURL

```bash
# Save to file
curl -H "x-api-key: your-secret-key" https://your-app.up.railway.app/api/products > products.json
```

## Monitoring & Logs

### View Logs in Railway Dashboard

1. Go to your project in Railway
2. Click on your service
3. Go to the **"Deployments"** tab
4. Click on the latest deployment
5. View live logs in the **"Logs"** section

### View Logs via CLI

```bash
railway logs
```

## Pricing

**Railway Free Tier:**
- **500 execution hours per month**
- **$5 credit/month**
- Perfect for development and light production use

**Railway Pro Tier:**
- **$5/month + usage**
- No execution hour limits
- Better for high-volume production use

For your use case (on-demand product fetches), the **free tier should be sufficient** unless you're fetching very frequently.

## Troubleshooting

### Deployment Failed

Check build logs in Railway dashboard. Common issues:
- Missing dependencies: Ensure `package.json` is correct
- Build errors: Run `npm run build` locally first

### API Returns 401 Unauthorized

- Check that you're sending the correct `x-api-key` header
- Or remove the `API_KEY` environment variable if you don't want authentication

### API Returns 500 Error

- Check Railway logs for error details
- Verify `SHOP_URL` and `ADMIN_API_ACCESS_TOKEN` are correct
- Ensure your Shopify app has the correct scopes

### Timeout for Large Stores

Railway has no timeout limits, but if you have 50k products:
- The first request may take 30-45 minutes
- This is normal and expected
- Your chatbot should handle long-running requests

### Environment Variables Not Working

- Ensure there are no quotes around values in Railway dashboard
- Click "Redeploy" after changing environment variables
- Variables should look like:
  - ✅ `SHOP_URL` = `mystore.myshopify.com`
  - ❌ `SHOP_URL` = `"mystore.myshopify.com"` (no quotes!)

## Security Best Practices

1. **Always use API_KEY** in production
2. **Use HTTPS** (Railway provides this automatically)
3. **Keep your Shopify token secret** - never commit to git
4. **Regenerate API_KEY** periodically
5. **Monitor logs** for unauthorized access attempts

## Updating Your App

After making code changes:

**Via GitHub:**
1. Commit and push changes
2. Railway automatically redeploys

**Via CLI:**
```bash
git add .
git commit -m "Updated feature"
git push origin main

# Or deploy directly:
railway up
```

## Next Steps

1. ✅ Deploy to Railway
2. ✅ Test the API endpoint
3. ✅ Configure your AI chatbot to use the endpoint
4. ✅ Monitor usage and logs
5. Consider setting up:
   - Custom domain (available in Railway settings)
   - Rate limiting for additional security
   - Monitoring/alerting

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Shopify API Docs**: https://shopify.dev/docs/api/admin-graphql

---

Your Shopify Product API is now running in the cloud and ready to serve product data with metafields! 🚀

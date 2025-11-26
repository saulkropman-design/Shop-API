import { shopifyApi, LATEST_API_VERSION, Session } from '@shopify/shopify-api';
import dotenv from 'dotenv';

dotenv.config();

const SHOP_URL = process.env.SHOP_URL;
const ADMIN_API_ACCESS_TOKEN = process.env.ADMIN_API_ACCESS_TOKEN;

if (!SHOP_URL || !ADMIN_API_ACCESS_TOKEN) {
  throw new Error(
    'Missing required environment variables: SHOP_URL and ADMIN_API_ACCESS_TOKEN must be set in .env file'
  );
}

// Initialize Shopify API client
const shopify = shopifyApi({
  apiKey: 'not-needed-for-private-app',
  apiSecretKey: 'not-needed-for-private-app',
  scopes: [],
  hostName: SHOP_URL.replace('https://', '').replace('http://', ''),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
  isCustomStoreApp: true,
  adminApiAccessToken: ADMIN_API_ACCESS_TOKEN,
});

// Create a session for the private app
const session = new Session({
  id: `offline_${SHOP_URL}`,
  shop: SHOP_URL.replace('https://', '').replace('http://', ''),
  state: 'offline',
  isOnline: false,
  accessToken: ADMIN_API_ACCESS_TOKEN,
});

// Create GraphQL client
export const graphqlClient = new shopify.clients.Graphql({ session });

export { shopify, session };

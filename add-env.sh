#!/bin/bash
source .env

echo "Adding environment variables to Vercel..."

echo "$ANTHROPIC_API_KEY" | vercel env add ANTHROPIC_API_KEY production
echo "$SUPABASE_URL" | vercel env add SUPABASE_URL production
echo "$SUPABASE_SERVICE_KEY" | vercel env add SUPABASE_SERVICE_KEY production
echo "$STRIPE_SECRET_KEY" | vercel env add STRIPE_SECRET_KEY production
echo "$STRIPE_PRICE_FULL_FIX" | vercel env add STRIPE_PRICE_FULL_FIX production
echo "$RESEND_API_KEY" | vercel env add RESEND_API_KEY production
echo "https://linkedin-deal-magnet-j7b8azzd9-eric-coffies-projects.vercel.app" | vercel env add BASE_URL production
echo "production" | vercel env add NODE_ENV production

echo "✅ Environment variables added!"

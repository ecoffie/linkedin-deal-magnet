#!/bin/bash

echo "🔧 Setting up Vercel environment variables..."

# Read .env and add to Vercel
while IFS='=' read -r key value; do
  # Skip comments and empty lines
  if [[ $key =~ ^#.*$ ]] || [[ -z "$key" ]]; then
    continue
  fi

  # Remove any quotes from value
  value=$(echo "$value" | sed 's/^"\(.*\)"$/\1/' | sed "s/^'\(.*\)'$/\1/")

  echo "Setting $key..."
  echo "$value" | vercel env add "$key" production --yes 2>&1 | grep -E "Success|Error|already" || true
done < .env

echo ""
echo "✅ Environment variables configured!"
echo ""
echo "🔄 Redeploying with new env vars..."
vercel --prod --yes

echo ""
echo "🎉 Deployment complete!"

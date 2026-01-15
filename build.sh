#!/bin/bash

# Build script for Render
echo "🚀 Starting custom build script..."

# Generate Prisma client
echo "📄 Generating Prisma client..."
npx prisma generate

# Build the NestJS application
echo "🔨 Building NestJS application..."
npx nest build

echo "✅ Build completed successfully!"


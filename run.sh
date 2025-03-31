#!/bin/bash

# Display welcome message
echo "=== Farewell Memories App ==="
echo "Starting the application..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies (this may take a few minutes)..."
  npm install
fi

# Start the application
echo "Starting the server..."
npm run dev
#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Failure Analysis Dashboard ===${NC}"
echo -e "${GREEN}Starting the application...${NC}"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo -e "${BLUE}Installing dependencies...${NC}"
  npm install
fi

# Start the development server
echo -e "${BLUE}Starting the development server...${NC}"
npm start

# This script will exit when the server is stopped 
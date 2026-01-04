FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY src ./src

# Build
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 3001

# Create data directory
RUN mkdir -p ./data

# Start server
CMD ["node", "dist/index.js"]

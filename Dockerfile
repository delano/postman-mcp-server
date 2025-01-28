# Generated by https://smithery.ai. See: https://smithery.ai/docs/config#dockerfile
# Use a Node.js image with pnpm pre-installed
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml first for better caching
COPY package.json pnpm-lock.yaml ./

# Install app dependencies
RUN npm install -g pnpm && pnpm install

# Bundle app source
COPY . .

# Build the TypeScript application
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable for Postman API Key
ENV POSTMAN_API_KEY=your_api_key_here

# Run the application
CMD ["node", "build/index.js"]

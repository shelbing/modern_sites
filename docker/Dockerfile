FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application (using Astro's build command)
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built assets from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=5000
ENV NODE_ENV=production
ENV SSR_MODE=true

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "./dist/server/entry.mjs"]

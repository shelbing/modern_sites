# Single-stage development build for local testing
FROM node:18-alpine

WORKDIR /app

# Install Git and other dependencies
RUN apk add --no-cache git

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=development

# Expose the port Astro runs on (default is 3000)
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]

# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build arguments (passati da docker-compose)
ARG REACT_APP_API_URL
ARG REACT_APP_NAME

# Set environment variables per il build
ENV REACT_APP_API_URL=${REACT_APP_API_URL:-/api}
ENV REACT_APP_NAME=${REACT_APP_NAME:-WasteWatch}

# Debug: mostra le variabili durante il build
RUN echo "Building with:" && \
    echo "REACT_APP_API_URL=$REACT_APP_API_URL" && \
    echo "REACT_APP_NAME=$REACT_APP_NAME"

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Install curl per health check
RUN apk add --no-cache curl

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Health check aggiornato
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
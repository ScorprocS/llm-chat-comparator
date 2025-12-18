# ============================================
# Stage 1: BUILD STAGE (Node.js environment)
# ============================================
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (only needed for building)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the Angular application
RUN npm run build -- --configuration production

# ============================================
# Stage 2: PRODUCTION STAGE (Nginx only)
# ============================================
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy ONLY the built artifacts from Stage 1
# This excludes node_modules and all build dependencies
COPY --from=build /app/dist/llm-chat-comparator/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

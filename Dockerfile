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

# Suppression des fichiers par défaut de Nginx et des privilèges inutiles
RUN rm -rf /usr/share/nginx/html/* && \
    chmod -R g+w /var/cache/nginx /var/run /var/log/nginx


    # 1. Créer les dossiers de cache et changer le propriétaire
# On s'assure que l'utilisateur nginx a les droits sur tout ce dont il a besoin
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

    
# Copy custom nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

# Copy ONLY the built artifacts from Stage 1
# This excludes node_modules and all build dependencies
COPY --from=build --chown=nginx:nginx /app/dist/llm-chat-comparator/browser /usr/share/nginx/html

# Sécurité : Exécuter en tant qu'utilisateur non-root
# L'image nginx alpine crée par défaut un utilisateur 'nginx' (UID 101)
USER nginx

EXPOSE 8080

# Ajout d'un Healthcheck pour surveiller l'état du conteneur
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

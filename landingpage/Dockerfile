# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files from the landingpage directory
COPY landingpage/package*.json ./
RUN npm ci

# Copy the rest of the landingpage project
COPY landingpage/ ./
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom nginx configuration
COPY landingpage/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

FROM node:20-alpine
# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Copy landing page build
COPY app/dist/ /usr/share/nginx/html/landing

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80


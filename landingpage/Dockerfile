FROM node:20-alpine

WORKDIR /app

COPY ./landingpage/package*.json ./
RUN npm ci

COPY ./landingpage .
RUN npm run build

# Copy landing page build
COPY app/dist/ /usr/share/nginx/html/landing

# Copy custom nginx configuration
COPY ./landingpage/nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80

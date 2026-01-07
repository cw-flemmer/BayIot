# --------- Stage 1: Build React ----------
FROM node:20-alpine AS dashboard-builder

WORKDIR /app

COPY dashboard/package*.json ./
RUN npm ci --legacy-peer-deps

COPY dashboard .
RUN npm run build


# --------- Stage 2: Nginx ----------
FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy React build from previous stage
COPY --from=dashboard-builder /app/dist /usr/share/nginx/html

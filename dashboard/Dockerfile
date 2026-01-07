FROM node:20-alpine AS dashboard-builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

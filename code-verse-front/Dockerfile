# Use an official Node.js runtime as a parent image
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine AS production-build
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d
# Copy from the stage 1
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
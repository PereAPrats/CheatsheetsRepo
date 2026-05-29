FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS api
WORKDIR /app
COPY package.json .
RUN npm install express pg
COPY --from=build /app/dist /app/dist
COPY server.js .
EXPOSE 3001
CMD ["node", "server.js"]

FROM nginx:alpine AS frontend
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080

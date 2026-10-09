# 构建阶段：容器内 npm install + next build（静态导出到 out/）
FROM node:20-bookworm AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段：nginx 托管 out/ 静态产物
FROM nginx:1.27-alpine
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 80

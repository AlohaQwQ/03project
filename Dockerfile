# 使用 Node.js 作为构建阶段
FROM node:20 as build

# 设置 npm 源
# RUN npm config set registry https://registry.npm.taobao.org \
    # && npm install -g npm
RUN npm config set strict-ssl false \
    && npm config set registry https://registry.npm.taobao.org/ \
    && npm install -g npm

# 设置工作目录
WORKDIR /root/03/html

# 复制依赖文件并安装依赖
COPY package.json package-lock.json ./
RUN npm ci

# 复制所有文件并构建
COPY . .
RUN npm run build

# 使用 Nginx 作为生产环境的服务器
FROM nginx:alpine

# 复制构建的文件到 Nginx 的 html 目录
COPY --from=build /root/03/html /usr/share/nginx/html
# COPY --from=builder /root/03/html/.next /usr/share/nginx/html/.next
# COPY --from=builder /root/03/html/public /usr/share/nginx/html/public # 确保路径正确
# COPY --from=builder /root/03/html/package.json /usr/share/nginx/html/package.json

# 复制 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
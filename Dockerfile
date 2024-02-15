FROM node:18-alpine as BUILD_STAGE

WORKDIR /extension

COPY . .

RUN npm install --silent -g pnpm
RUN pnpm install
RUN pnpm build

FROM nginx:1.25.3

WORKDIR /usr/share/nginx/html

COPY --from=BUILD_STAGE /extension/dist ./
COPY ["./dev/nginx.conf", "/etc/nginx/conf.d/default.conf"]

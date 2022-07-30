FROM node:lts-alpine as public_app_build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json ./
RUN npm install --legacy-peer-deps
COPY . ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=public_app_build /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

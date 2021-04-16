FROM node:14 AS build

ARG url
ARG port

#RUN npm install -g yarn
WORKDIR /opt/ng
COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

FROM nginx
USER root
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /opt/ng/build /usr/share/nginx/html
RUN chown www-data /usr/share/nginx/html/*
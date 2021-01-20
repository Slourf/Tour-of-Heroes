FROM node:14 AS build

USER root
#RUN npm install -g yarn

WORKDIR /opt/ng
COPY package.json ./
RUN yarn install

COPY . .
RUN pwd
RUN ls
RUN ./node_module/.bin/ng build --prod

FROM nginx
COPY docker/default.conf /etc/nginx/conf.d/default.conf
RUN ls /opt/ng/dist/
COPY --from=build /opt/ng/dist/app-name /usr/share/nginx/html
FROM node:14 AS build

USER root
#RUN npm install -g yarn

WORKDIR /opt/ng
COPY package.json ./
RUN yarn install

COPY . .
RUN ls
# RUN ng build --prod

FROM nginx
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /opt/ng/dist/app-name /usr/share/nginx/html
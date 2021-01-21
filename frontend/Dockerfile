FROM node:14 AS build

USER root
#RUN npm install -g yarn
WORKDIR /opt/ng
COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN ./node_modules/@angular/cli/bin/ng build --prod

FROM nginx
USER root
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /opt/ng/dist/angular-tour-of-heroes /usr/share/nginx/html
RUN chown www-data /usr/share/nginx/html/*
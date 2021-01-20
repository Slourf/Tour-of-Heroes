FROM node:14 AS compile-image

USER root
#RUN npm install -g yarn

WORKDIR /opt/ng
COPY package.json ./
RUN yarn install

ENV PATH="/opt/ng/node_modules/.bin:$PATH" 

COPY . .
RUN ls
RUN ng build --prod

FROM nginx
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=compile-image /opt/ng/dist/app-name /usr/share/nginx/html
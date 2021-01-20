FROM node:14 AS compile-image

USER root
RUN npm install -g yarn

WORKDIR /opt/ng
COPY ../../frontend/.npmrc ../../frontend/package.json ../../frontend/yarn.lock ./
RUN yarn install

ENV PATH="./node_modules/.bin:$PATH" 

COPY ../../frontend/* ./
RUN ng build --prod

FROM nginx
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=compile-image /opt/ng/dist/app-name /usr/share/nginx/html
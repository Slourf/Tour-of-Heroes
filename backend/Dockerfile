FROM node:14

ARG DB_USER
ARG DB_PASSWORD

ENV ENV_DB_USER=$DB_USER
ENV ENV_DB_PASSWORD=$DB_PASSWORD

WORKDIR /usr/src/app
COPY . .
RUN yarn install
RUN ls -l /usr/src/app/node_modules/tslint/bin/tslint

EXPOSE 3000

CMD ls -l /usr/src/app/node_modules/tslint/bin/tslint & yarn start $ENV_DB_USER $ENV_DB_PASSWORD

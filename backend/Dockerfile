FROM node:14

ARG DB_USER
ARG DB_PASSWORD

ENV ENV_DB_USER=$DB_USER
ENV ENV_DB_PASSWORD=$DB_PASSWORD

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm ci --only=production

COPY . .
EXPOSE 3000

CMD yarn start $ENV_DB_USER $ENV_DB_PASSWORD

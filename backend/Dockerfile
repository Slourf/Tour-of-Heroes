FROM node:14

ARG DB_USER="$DB_USER"
ARG DB_PASSWORD="$DB_PASSWORD"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm ci --only=production
RUN echo "$DB_USER" $DB_PASSWORD

COPY . .
EXPOSE 3000

CMD [ "node", "server.js", ${DB_USER}, ${DB_PASSWORD} ]

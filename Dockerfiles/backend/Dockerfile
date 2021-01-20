FROM node:14

WORKDIR /usr/src/app
COPY "../../backend/package*.json" "./"
RUN npm install
RUN npm ci --only=production

COPY ../../backend/* .
EXPOSE 3000

CMD [ "node", "server.js" ]

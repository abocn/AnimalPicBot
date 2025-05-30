FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

VOLUME /usr/src/app/.env

CMD ["npm", "start"]
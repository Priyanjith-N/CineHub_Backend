FROM node:20.12.0-alpine

WORKDIR /CineHub Backend

COPY package*.json ./

RUN npm install --save-dev ts-node typescript

RUN npm install

COPY . .

CMD ["npm", "start"]
FROM node

RUN mkdir /app
WORKDIR /app

ADD package.json /app/package.json
RUN npm install


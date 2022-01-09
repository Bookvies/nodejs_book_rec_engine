FROM node:16
WORKDIR /home/node/app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm install --prefix=front
RUN npm run all:build
EXPOSE 8080
CMD [ "npm", "start" ]
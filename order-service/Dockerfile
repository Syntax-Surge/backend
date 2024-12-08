FROM node

WORKDIR /app/order-service

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3005

CMD ["npm", "start"]
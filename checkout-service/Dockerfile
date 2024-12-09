FROM node

WORKDIR /app/checkout-service

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
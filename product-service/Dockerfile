FROM node

WORKDIR /app/product-service

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3004

CMD ["npm", "start"]
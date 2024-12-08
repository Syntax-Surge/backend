FROM node

WORKDIR /app/api-gateway

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "start"]
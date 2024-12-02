
const { Sequelize } = require("sequelize");
require("dotenv").config();

const server = process.env.SQL_SERVER;
const database = process.env.SQL_DATABASE;
const port = 1433;
const user = process.env.SQL_USERNAME;
const password = process.env.SQL_PASSWORD;

const sequelize = new Sequelize(database, user, password, {
  host: server,
  port: port,
  dialect: "mssql",
  logging: console.log,
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate:
        process.env.SQL_TRUST_CERTIFICATE === "yes" ? true : false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully...");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const orders = require('../models/order')(
  sequelize,
  Sequelize
);
const orderItems = require('../models/orderItem')(
  sequelize,
  Sequelize
);
const payments = require('../models/payment')(
  sequelize,
  Sequelize
);

const ShoppingCart = require("../models/shoppingcart.module")(
  sequelize,
  Sequelize
);

orders.hasMany(orderItems, { foreignKey: 'orderId', as: 'items' });
orderItems.belongsTo(orders, { foreignKey: 'orderId' });

orders.hasOne(payments, { foreignKey: 'orderId', as: 'payment' });
payments.belongsTo(orders, { foreignKey: 'orderId' });


db.orders = orders;
db.orderItems = orderItems;
db.payments = payments;
db.ShoppingCart=ShoppingCart
db.connectDB = connectDB;

module.exports = db;

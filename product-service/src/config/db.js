const { Sequelize } = require('sequelize');
const { SequelizeMethod } = require('sequelize/lib/utils');
require('dotenv').config();

const server = process.env.SQL_SERVER;
const database = process.env.SQL_DATABASE;
const port = 1433;
const user = process.env.SQL_USERNAME;
const password = process.env.SQL_PASSWORD;


const sequelize = new Sequelize(database, user, password, {
  host: server,
  port: port,
  dialect: 'mssql',
  logging: console.log,
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: process.env.SQL_TRUST_CERTIFICATE === 'yes' ? true : false,
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const Category = require('../models/category.model')(sequelize, Sequelize)
const Product = require("../models/product.model")(sequelize, SequelizeMethod)
const Review = require("../models/review.model")(sequelize, SequelizeMethod)

Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

const db = {
  sequelize,
  Sequelize,
  Category,
  Product,
  Review,
  connectDB,
}
module.exports = db;
// module.exports = { Category, connectDB, sequelize };

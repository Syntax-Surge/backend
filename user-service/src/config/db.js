// db.js
const { Sequelize } = require('sequelize');
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


// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};


const User = require('../model/user.model')(sequelize, Sequelize.DataTypes); 
const Admin = require('../model/admin')(sequelize, Sequelize.DataTypes);

const db = {
  sequelize,
  Sequelize,
  User,
  Admin,
  connectDB   
};
 
const Address = require('../model/address.model')(sequelize, Sequelize.DataTypes);
// const orderItems = require('../models/orderItem')(sequelize,Sequelize);
 
db.users = User;
db.Address=Address; 
module.exports = db;
// module.exports = { connectDB  , sequelize};

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

module.exports = (sequelize) => {
    const Product = sequelize.define('Product',
        {
            id: {
                type: DataTypes.INTEGER,
                
            }
        }
    )
}
const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const payments = sequelize.define('payments', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      paymentIntentId:  {
        type: Sequelize.STRING,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      paymentMethod: {
        type: DataTypes.ENUM('credit_card', 'paypal', 'bank_transfer'),
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'success', 'failed'),
        defaultValue: 'pending',
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  
    return payments;
  };
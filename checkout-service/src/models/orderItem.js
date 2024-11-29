

module.exports = (sequelize, Sequelize) => {
    const orderItems = sequelize.define('OrderItems', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      productId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        // references: {
        //   model: 'Orders',
        //   key: 'id',
        // },
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
    });
  
    return orderItems;
  };
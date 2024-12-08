module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define("address", {
    userId: {
      type: Sequelize.STRING,
    },
    shippingAddressLine1: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    shippingAddressLine2: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    shippingCity: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    shippingState: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    shippingPostalCode: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    shippingCountry: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });
  // User.associate = function (models) {
  //   User.hasMany(models.budget);
  // };
  return Address;
};
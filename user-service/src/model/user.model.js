module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
    },
    contactNo: {
      type: Sequelize.STRING,
    },
    profileImage: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    billingAddressLine1: {
      type: Sequelize.STRING,
    },
    billingAddressLine2: {
      type: Sequelize.STRING,
    },
    billingCity: {
      type: Sequelize.STRING,
    },
    billingState: {
      type: Sequelize.STRING,
    },
    billingPostalCode: {
      type: Sequelize.STRING,
    },
    billingCountry: {
      type: Sequelize.STRING,
    },
    shippingAddressLine1: {
      type: Sequelize.STRING,
    },
    shippingAddressLine2: {
      type: Sequelize.STRING,
    },
    shippingCity: {
      type: Sequelize.STRING,
    },
    shippingState: {
      type: Sequelize.STRING,
    },
    shippingPostalCode: {
      type: Sequelize.STRING,
    },
    shippingCountry: {
      type: Sequelize.STRING,
    },
  });
  // User.associate = function (models) {
  //   User.hasMany(models.budget);
  // };
  return User;
};
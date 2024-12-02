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
    // billingAddressLine1: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
    // billingAddressLine2: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
    // billingCity: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
    // billingState: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
    // billingPostalCode: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
    // billingCountry: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
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
  return User;
};
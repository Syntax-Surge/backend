// module.exports = (sequelize, Sequelize) => {
//     const User = sequelize.define("user", {
//       firstName: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       lastName: {
//         type: Sequelize.STRING,
//         allowNull: true,
//       },
//       email: {
//         type: Sequelize.STRING,
//         validate: {
//           isEmail: true,
//         },
//         allowNull: false,
//       },
//       password: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       contactNo: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       profileImage :{
//         type: Sequelize.STRING,
//         allowNull: true,
//       }
//     });
//     // User.associate = function (models) {
//     //   User.hasMany(models.budget);
//     // };
//     return User;
//   };


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
      llowNull: true,
    },
    billingAddressLine2: {
      type: Sequelize.STRING,
      llowNull: true,
    },
    billingCity: {
      type: Sequelize.STRING,
      llowNull: true,
    },
    billingState: {
      type: Sequelize.STRING,
      llowNull: true,
    },
    billingPostalCode: {
      type: Sequelize.STRING,
      llowNull: true,
    },
    billingCountry: {
      type: Sequelize.STRING,
      llowNull: true,
    },
    shippingAddressLine1: {
      type: Sequelize.STRING,
      llowNull: true,
    },
    shippingAddressLine2: {
      type: Sequelize.STRING,
      llowNull: true,
    },
    shippingCity: {
      type: Sequelize.STRING,
      llowNull: true,
    },
    shippingState: {
      type: Sequelize.STRING,
      llowNull: true,
    },
    shippingPostalCode: {
      type: Sequelize.STRING,
      llowNull: true,
    },
    shippingCountry: {
      type: Sequelize.STRING,
      llowNull: true,
    },
  });
  // User.associate = function (models) {
  //   User.hasMany(models.budget);
  // };
  return User;
};
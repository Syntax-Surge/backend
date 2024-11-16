module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
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
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contactNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profileImage :{
        type: Sequelize.STRING,
        allowNull: true,
      }
    });
    // User.associate = function (models) {
    //   User.hasMany(models.budget);
    // };
    return User;
  };
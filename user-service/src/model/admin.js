module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("admin", {
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
    // Admin.associate = function (models) {
    //   Admin.hasMany(models.budget);
    // };
    return Admin;
  };
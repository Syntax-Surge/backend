const { DataTypes } = require("sequelize");
// const { sequelize } = require("../config/db");

module.exports = (sequelize) => {
  const Product = sequelize.define("Product", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    productDescription: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    pictureLocation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    unitWeight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    availableQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Categories",
        key: "id",
      },
      onUpdate: "CASCADE",
    },
  });
  return Product;
};

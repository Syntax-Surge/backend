const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ShoppingCart = sequelize.define("ShoppingCart", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Users table name
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products", // Products table name
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, // Ensure at least one product is added to the cart
      },
    },
  });

  return ShoppingCart;
};

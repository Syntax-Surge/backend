const { DataTypes, Model, Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
    const Category = sequelize.define('Category',
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                parent_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'Categories',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                image: {
                    type: DataTypes.STRING(500),
                    allowNull: true,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                }
            });

    // Define associations for self-referential relationship
    Category.hasMany(Category, {
        foreignKey: 'parent_id',
        as: 'subcategories', // Alias for subcategories
    });

    Category.belongsTo(Category, {
        foreignKey: 'parent_id',
        as: 'parent', // Alias for parent category
    });
    return Category;
}
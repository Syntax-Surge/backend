const { DataTypes, Model, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');


// const Category = sequelize.define('Category',
//     {
//         id: {
//                 type: DataTypes.INTEGER,
//                 primaryKey: true,
//                 autoIncrement: true,
//             },
//             parent_id: {
//                 type: DataTypes.INTEGER,
//                 allowNull: true,
//                 references: {
//                     model: 'Categories',
//                     key: 'id',
//                 },
//                 onUpdate: 'CASCADE',
//                 onDelete: 'SET NULL',
//             },
//             name: {
//                 type: DataTypes.STRING(255),
//                 allowNull: false,
//             },
//             description: {
//                 type: DataTypes.STRING(255),
//                 allowNull: true,
//             },
//             image: {
//                 type: DataTypes.STRING(500),
//                 allowNull: true,
//             },
//             created_at: {
//                 type: DataTypes.DATE,
//                 defaultValue: DataTypes.NOW,
//             },
//             updated_at: {
//                 type: DataTypes.DATE,
//                 defaultValue: DataTypes.NOW,
//             }
//         },
//         {
//             tableName: 'Categories',
//             timestamps: false,
//         }
//     )
// module.exports = Category;

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
                        onDelete: 'SET NULL',
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
                    created_at: {
                        type: DataTypes.DATE,
                        defaultValue: DataTypes.NOW,
                    },
                    updated_at: {
                        type: DataTypes.DATE,
                        defaultValue: DataTypes.NOW,
                    }
                });
    return Category;
}
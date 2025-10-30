const sequelize = require("../config/database")

const { DataTypes } = require("sequelize")

const ProductsImages = sequelize.define("ProductImages", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Products",
      key: "id",
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isURL: true,
      },
    },
  },
})

module.exports = ProductsImages

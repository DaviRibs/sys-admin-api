const sequelize = require("../config/database")

const Categories = require("./categories")

const Products = require("./products")

const ProductsImages = require("./products_images")

sequelize
  .sync({
    alter: true,
  })
  .then(() => console.log("Tabelas sincronizadas com sucesso"))
  .catch((error) => console.error("Erro ao sicronizar tabelas", error))

module.exports = {
  Categories,
  Products,
  ProductsImages,
}

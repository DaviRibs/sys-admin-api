const express = require("express")
const router = express.Router()

const productsController = require("../controllers/products")

const productsMiddewares = require("../middlewares/products")

router.post(
  "/products",
  productsMiddewares.validateInsertProduct,
  productsController.insertProduct
)

router.get("/products", productsController.getAllProducts)

module.exports = router

const express = require('express')
const router = express.Router()

const productsController = require('../controllers/products')

const productsMiddewares = require('../middlewares/products')
const { authToken } = require('../middlewares/authToken')
const axios = require('axios')
router.post(
  '/products',
  authToken(['seller', 'admin']),
  productsMiddewares.validateInsertProduct,
  productsController.insertProduct
)

router.get('/products', productsController.getAllProducts)

module.exports = router

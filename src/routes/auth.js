const express = require('express')

const router = express.Router()

const authController = require('../controllers/auth')

const authMiddleware = require('../middlewares/auth')
const { authToken } = require('../middlewares/authToken')

router.post('/login', authMiddleware.validateLogin, authController.login)

router.get('/profile', authToken(), authController.profile)
router.post('/active-user', authController.activeUser)
module.exports = router

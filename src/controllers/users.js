const { encryptUserToken } = require('../helpers/encrypt-user-token')
const { Users } = require('../models')
const redisClient = require('../config/redis')
const { sendEmail } = require('../helpers/email-service')
async function createUser(req, res) {
  try {
    const user = await Users.create(req.body)

    const token = await encryptUserToken(user)

    await redisClient.set(`user:${user.id}`, token, {
      EX: 7 * 24 * 60 * 60,
    })

    await sendEmail(
      user.email,
      user.name,
      'Bem vindo ao nosso e-commerce',
      token
    )

    return res.status(201).send({
      message: 'Usuario criado com sucesso!',
    })
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    })
  }
}

module.exports = {
  createUser,
}

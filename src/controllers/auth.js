const jwt = require('jsonwebtoken')
const { decryptUserToken } = require('../helpers/encrypt-user-token')
const redisClient = require('../config/redis')
const { Users } = require('../models')

async function login(req, res) {
  try {
    const user = req.user

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
    return res.send({
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image_url,
      },
    })
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    })
  }
}
async function profile(req, res) {
  const user = req.user
  try {
    return res.send({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image_url,
    })
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    })
  }
}
async function activeUser(req, res) {
  const { token } = req.body
  const cleanedToken = token.replace(/ /g, '+')

  const user = await decryptUserToken(cleanedToken)

  if (!user) {
    return res.status(400).send({
      error: 'Token inválido',
    })
  }
  try {
    const redisToken = await redisClient.get(`user:${user.id}`)
    if (!redisToken || redisToken !== cleanedToken) {
      return res.status(400).send({
        error: 'Token inválido',
      })
    }
    await Users.update(
      { active: true },
      {
        where: {
          id: user.id,
        },
      }
    )
    await redisClient.del(`user:${user.id}`)
    return res.send({
      message: 'Usuário ativado com sucesso',
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Erro ao ativar usuário',
    })
  }
}

module.exports = {
  login,
  profile,
  activeUser,
}

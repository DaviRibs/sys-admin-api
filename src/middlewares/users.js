const { Users } = require("../models")
const bcrypt = require("bcrypt")

async function validateCreateUser(req, res, next) {
  const { name, email, password, role } = req.body

  if (!name || !email || !password || !role) {
    return res.status(400).send({
      error: "Todos os campos são obrigatorios",
    })
  }

  if (password.legth < 8) {
    return res.status(400).send({
      error: "A senha deve ter no minimo 8 caracteres",
    })
  }

  try {
    const existUser = await Users.findOne({
      where: {
        email: email,
      },
    })
    if (existUser) {
      return res.status(400).send({
        error: "Email já cadastrado",
      })
    }
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    })
  }
  const hashedPassWord = await bcrypt.hash(password, 10)

  req.body.password = hashedPassWord

  next()
}

module.exports = {
  validateCreateUser,
}

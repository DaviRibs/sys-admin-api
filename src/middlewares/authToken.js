const jwt = require("jsonwebtoken")
const { Users } = require("../models")

function authToken(allowedRoles = []) {
  return async (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
      return res.status(401).send({
        error: "Token não fornecido",
      })
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await Users.findByPk(decoded.id)
      if (!user) {
        return res.status(401).send({
          error: "Usuário não encontrado",
        })
      }
    } catch (error) {}
  }
}

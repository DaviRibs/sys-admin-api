const express = require("express")
const app = express()
const productsRoutes = require("./src/routes/products")
const usersRoutes = require("./src/routes/users")
const categoriesRoutes = require("./src/routes/categories")
require("./src/models")
const authRoutes = require("./src/routes/auth")

app.use(express.json())

const PORT = 4467

app.get("/", (req, res) => {
  res.send("Olá Davi, seja bem vindo!")
})

app.use(productsRoutes)
app.use(categoriesRoutes)
app.use(usersRoutes)
app.use(authRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

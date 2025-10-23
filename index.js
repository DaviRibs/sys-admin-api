const express = require("express")
const app = express()
const productsRoutes = require("./src/routes/products")
require("./src/models")

app.use(express.json())

const PORT = 4467

app.get("/", (req, res) => {
  res.send("Olá Davi, seja bem vindo!")
})

app.use(productsRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

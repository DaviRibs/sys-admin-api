const { createClient } = require('redis')

const redisClient = createClient({
  url: process.env.REDIS_URL,
})

redisClient.on('error', (err) => {
  console.error('Erro ao conectar ao Redis:', err)
})

redisClient
  .connect()
  .then(() => console.log('Redis connectado com sucesso'))
  .catch(console.error)

module.exports = redisClient

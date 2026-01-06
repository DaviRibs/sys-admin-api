const axios = require('axios')

const emailApi = axios.create({
  baseURL: process.env.EMAIL_API_URL,
  headers: {
    token: process.env.EMAIL_API_TOKEN,
  },
})

module.exports = emailApi

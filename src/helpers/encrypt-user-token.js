const CryptoJS = require('crypto-js')

async function encryptUserToken(user) {
  try {
    const hashedUser = CryptoJS.AES.encrypt(
      JSON.stringify(user),
      process.env.ENCRYPT_SECRET
    ).toString()
    return hashedUser
  } catch (error) {
    throw new Error('Erro ao criptografar user', error)
  }
}

module.exports = {
  encryptUserToken,
}

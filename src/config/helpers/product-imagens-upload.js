const { PutObjectCommand } = require("@aws-sdk/client-s3")
const { s3Client } = require("../aws-s3")
const { ProductsImages } = require("../../models")

async function uploadFileToS3(file) {
  const fileName = "products/${Date.now}()-${file.originalname}"

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  })
  await s3Client.send(comand)

  const region = process.env.AWS_REGION
  const url = `https://${process.env.AWS_S3_BUCKET}.s3.${region}.amazonaws.com/${fileName}`

  return url
}

/**
 * Processa para upload de múltiplas imagens para s3
 * @param {Array} files - Array de arquivos a serem enviados
 * @returns {Promise<Array<Array>} - Array de arquivos processados
 */
async function processMultipleImagensUpload(files) {
  if (!files || files.length === 0) {
    return []
  }

  const uploadPromises = files.map((file) => uploadFileToS3(file))
  const urls = await Promise.all(uploadPromises)

  return urls
}

/**
 * Salva as imagens na tabela ProductsImages
 * @param {String} productId - ID do produto
 * @param {Array } urls -Array de URLs das imagens
 * @returns {Promise<Array>} - Array de IDs das imagens salvas
 */

async function saveProductsImagens(productId, urls) {
  if (!urls || urls.length === 0) {
    return []
  }

  const imagensData = urls.map((image) => ({
    product_id: productId,
    url: image,
  }))
  const savedImages = await ProductsImages.bulkCreate(imagensData)
  return savedImages
}

/**
 * Processa upload completo: faz upload no s3 e salva no banco
 * @param {String} productId - Id do produto
 * @param {Array} files - Array de arquivos
 * @returns {Promise<Array>} - Array de imagens salvas
 */

async function uploadAndSaveProductsImagens(productId, files) {
  try {
    const urls = await processMultipleImagensUpload(files)

    const images = await saveProductsImagens(productId, urls)
    return images
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {
  uploadAndSaveProductsImagens,
  saveProductsImagens,
  processMultipleImagensUpload,
}

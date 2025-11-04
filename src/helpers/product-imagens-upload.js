const { PutObjectCommand } = require("@aws-sdk/client-s3")
const { s3Client } = require("../config/aws-s3")
const { ProductsImages } = require("../models")
require("dotenv").config()

async function uploadFileToS3(file) {
  const fileName = `products/${Date.now()}-${file.originalname}`

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  })

  await s3Client.send(command)

  const region = process.env.AWS_REGION
  const url = `https://${process.env.AWS_S3_BUCKET}.s3.${region}.amazonaws.com/${fileName}`

  return url
}

/**
 * Processa upload de múltiplas imagens para o S3
 * @param {Array} files - Array de arquivos a serem enviados
 * @returns {Promise<Array>} - Array de arquivos processados
 */
async function processMultipleImagesUpload(files) {
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
 * @param {Array} urls - Array de URLs das imagens
 * @returns {Promise<Array>} - Array de imagens salvas
 */
async function saveProductsImages(productId, urls) {
  if (!urls || urls.length === 0) {
    return []
  }

  const imagesData = urls.map((image) => ({
    product_id: productId,
    url: image,
  }))

  const savedImages = await ProductsImages.bulkCreate(imagesData)
  return savedImages
}

/**
 * Processa upload completo: fazupload no s3 e salva no banco
 * @param {String} productId - Id do produto
 * @param {Array} files - Array de arquivos
 * @returns {Promise<Array>} - Array de imagens salvas
 */
async function uploadAndSaveProductsImages(productId, files) {
  try {
    const urls = await processMultipleImagesUpload(files)

    const images = await saveProductsImages(productId, urls)

    return images
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {
  uploadAndSaveProductsImages,
  saveProductsImages,
  processMultipleImagesUpload,
}

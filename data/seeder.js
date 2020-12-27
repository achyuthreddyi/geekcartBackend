// const mongoose = require('mongoose')
// require('dotenv').config()
const product = require('../products/productModel')
const { connectDB } = require('../config/connectDB')
const products = require('./products')

connectDB()

const importData = async () => {
  console.log(process)
  try {
    await product.createListOfDocuments(products)

    console.log('data imported '.green.inverse)
    process.exit()
  } catch (error) {
    console.log(`${error}`.red.inverse)
    process.exit(1)
  }
}

importData()

// const formidable = require('formidable')
// const fs = require('fs')
// const product = require('../products/productModel')

// exports.uploadProduct = async (req, res, next) => {
//   const newProduct = new product() // eslint-disable-line

//   try {
//     const form = new formidable.IncomingForm()
//     form.keepExtensions = true
//     form.parse(req, async (err, fields, file) => {
//       if (err) {
//         res.status(400).json({
//           error: 'error in the image'
//         })
//       }
//       const { price, name, description, category, stock } = fields
//       if (!name || !price || !description || !category || !stock) {
//         res.status(400).json({
//           error: 'please include all the data of the product'
//         })
//       }
//       newProduct.name = name
//       newProduct.price = price
//       newProduct.description = description
//       newProduct.category = category
//       newProduct.stock = stock
//       if (file.photo) {
//         if (file.photo.size > 3000000) {
//           res.status(400).json({
//             error: 'photo exceeding the limit'
//           })
//         } else {
//           newProduct.photo.data = fs.readFileSync(file.photo.path)
//           newProduct.photo.contentType = file.photo.type
//           const uploadedPhoto = await newProduct.save()
//           console.log('uploaded photo into the database', uploadedPhoto)
//           res.status(201).json(uploadedPhoto)
//         }
//       } else {
//         res.status(400).json({
//           error: 'photo of the product is very essential'
//         })
//       }
//     })
//   } catch (err) {
//     return {
//       error: 'error uploading the product to the databases'
//     }
//   }
// }

// console.log('in the middleware', typeof product)
// // const productModel = new product()
// const newProduct = await product().createProduct(req)
// console.log('new Product in the middlwware', newProduct)
// next()

const path = require('path')
const express = require('express')
const multer = require('multer')
const router = express.Router()

const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  }
})

function checkFileType (file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!') // eslint-disable-line
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
})

router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`)
})

module.exports = router

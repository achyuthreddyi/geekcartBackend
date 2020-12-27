const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')
const product = require('../products/productModel')

exports.updateProduct = async (req, res, next) => {
  let updateProduct = await product.getDocumentById(req.product._id)

  try {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, file) => {
      if (err) {
        res.status(400).json({
          error: 'error in the image'
        })
      }
      updateProduct = _.extend(updateProduct, fields)

      if (file.photo) {
        if (file.photo.size > 3000000) {
          res.status(400).json({
            error: 'photo exceeding the limit'
          })
        } else {
          updateProduct.photo.data = fs.readFileSync(file.photo.path)
          updateProduct.photo.contentType = file.photo.type
          const uploadedProduct = await updateProduct.save()
          if (!uploadedProduct) {
            res.status(400).json({
              error: 'error while updating the data'
            })
          }

          res.status(201).json(uploadedProduct)
        }
      } else {
        res.status(400).json({
          error: 'photo of the product is very essential'
        })
      }
    })
  } catch (err) {
    return {
      error: 'error uploading the product to the databases'
    }
  }
}

// console.log('in the middleware', typeof product)
// // const productModel = new product()
// const newProduct = await product().createProduct(req)
// console.log('new Product in the middlwware', newProduct)
// next()

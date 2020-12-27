const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  user: {
    type: ObjectId,
    required: true,
    ref: 'User'
  }
})

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1500
    },
    price: {
      type: Number,
      required: true,
      maxlength: 32,
      trim: true
    },
    reviews: [reviewSchema],
    // TODO: implement the brand of the product
    brand: {
      type: String,
      required: true
    },
    category: {
      type: String,
      // ref: 'product',
      required: true
    },
    countInStock: {
      type: Number
    },
    sold: {
      type: Number,
      default: 0
    },
    // FIXME:  put this into s3 buckets and get the link Solved
    image: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      default: 0
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
)

const Product = mongoose.model('Product', productSchema)

exports.createDocument = async id => {
  try {
    const newProduct = await Product.create({
      name: 'Sample Product',
      price: 0,
      user: id,
      image: '/images/sample.jpeg',
      brand: 'Sample Brand',
      category: 'Sample Category',
      countInStock: 0,
      numReviews: 0,
      description: 'sample description'
    })
    return newProduct
  } catch (err) {
    return {
      error: 'error creating a product'
    }
  }
}

//  Only for the initial phase
// exports.createListOfDocuments = async products => {
//   try {
//     const productList = await product.insertMany(products)
//     return productList
//   } catch (err) {
//     return {
//       error: 'error uploading many products'
//     }
//   }
// }

exports.getAllDocuments = async keyword => {
  try {
    return await Product.find({ ...keyword })
  } catch (err) {
    return {
      error: 'No products found in the database',
      err
    }
  }
}

exports.getDocumentById = async id => {
  try {
    return await Product.findById(id)
  } catch (err) {
    return {
      error: 'error getting the product by id',
      err
    }
  }
}

exports.getDocumentByName = async name => {
  try {
    return await Product.find({ name })
  } catch (err) {
    return {
      error: 'error getting the product by name',
      err
    }
  }
}

exports.updateDocument = async productData => {
  try {
    const { productId, newProductDetails } = productData
    // FIXME: change this things
    //     for (const [key, value] of Object.entries(newProductDetails)) {
    //   productDb[key] = value
    // }

    const productDB = await Product.findById(productId)
    if (productDB) {
      productDB.name = newProductDetails.name || Product.name
      productDB.description =
        newProductDetails.description || Product.description
      productDB.price = newProductDetails.price || Product.price
      productDB.category = newProductDetails.category || Product.category
      productDB.brand = newProductDetails.brand || Product.brand
      productDB.countInStock =
        newProductDetails.countInStock || Product.countInStock
      productDB.sold = newProductDetails.sold || Product.sold
      productDB.image = newProductDetails.image || Product.image

      const updatedproduct = await productDB.save()
      return updatedproduct
    } else {
      return {
        error: 'product product does not exists in our records'
      }
    }
  } catch (err) {
    return {
      error: 'error updateing the product by id',
      err
    }
  }
}

exports.deleteDocument = async id => {
  try {
    return await Product.deleteOne({ _id: id })
  } catch (err) {
    return {
      error: 'error deleting the product from the database',
      err
    }
  }
}

exports.addReviewDocument = async req => {
  try {
    console.log('coming in the addreviewproduct', req.product)
    const { rating, comment } = req.body
    const productDB = req.product
    console.log('product to review ', productDB)
    if (productDB) {
      const alreadyReviewed = productDB.reviews.find(
        item => item.user.toString() === req.user._id.toString()
      )
      if (alreadyReviewed) {
        console.log('product already reviewwed')
        return {
          error: 'You have already reviewed this product'
        }
      }
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        createdAt: Date.now()
      }
      productDB.reviews.push(review)
      productDB.numReviews = productDB.reviews.length
      productDB.rating =
        productDB.reviews.reduce((acc, item) => item.rating + acc, 0) /
        productDB.reviews.length

      const reviewedProduct = await productDB.save()
      return reviewedProduct
    }
  } catch (err) {
    console.log(err)
    return {
      error: 'error adding a new review',
      err
    }
  }
}
exports.getTopDocuments = async _ => {
  const topProducts = await Product.find()
    .sort({ rating: -1 })
    .limit(3)
  return topProducts
}

// module.exports = product

// productSchema.methods = {
//   createProduct: async function (req) {
//     try {
//       const form = new formidable.IncomingForm()
//       form.keepExtensions = true

//       form.parse(req, async (err, fields, file) => {
//         if (err) {
//           console.log('place 101')
//           return {
//             error: 'problem with image'
//           }
//         }
//         const { price, name, description, category, stock } = fields

//         if (!price || !name || !description || !category || !stock) {
//           console.log('place102')
//           return {
//             error: 'please include all fields '
//           }
//         }
//         this.name = name
//         this.price = price
//         this.description = description
//         this.category = category
//         this.stock = stock

//         if (file.photo) {
//           if (file.photo.size > 3000000) {
//             return {
//               error: 'file size is big '
//             }
//           } else {
//             this.photo.data = fs.readFileSync(file.photo.path)
//             this.photo.contentType = file.photo.type
//           }
//         }

//         const uploadedProduct = await this.save()
//         console.log('uploaded documnet ', uploadedProduct)
//         return uploadedProduct
//         // save to the database
//       })

//       // return await product.create(newproduct)
//     } catch (err) {
//       return {
//         error: 'error creating a new product',
//         err
//       }
//     }
//   }
// }

// const product = require('./productModel')
const {
  createDocument,
  getAllDocuments,
  getDocumentById,
  // getDocumentByName,
  updateDocument,
  deleteDocument,
  addReviewDocument,
  getTopDocuments
} = require('./productModel')

// @desc    creating a product
// @route   POST /api/products/admin
// @access  Private/Admin

exports.createProduct = async (req, res) => {
  const createdProduct = await createDocument(req.user._id)
  if (!createdProduct.error) {
    res.status(200).json(createdProduct)
  } else {
    res.status(400).json(createdProduct)
  }
}

// @desc    get all products
// @route   POST /api/products/
// @access  Public

exports.getAllProducts = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i'
        }
      }
    : {}

  const products = await getAllDocuments(keyword)
  if (!products.error) {
    res.status(200).json(products)
  } else {
    res.status(400).json(products)
  }
}

// @desc    getting product by id
// @route   GET /api/products/:productId
// @access  Public

exports.getProduct = async (req, res) => {
  // req.product.photo = undefined
  console.log('inside the getProduct')
  return res.status(200).json(req.product)
}

// @desc    updating a product
// @route   PUT /api/products/admin
// @access  Private/Admin

exports.updateProduct = async (req, res) => {
  console.log('coming in update product method')
  const updatedProduct = await updateDocument({
    productId: req.product._id,
    newProductDetails: req.body
  })
  if (!updatedProduct.error) {
    res.status(200).json(updatedProduct)
  } else {
    res.status(400).json(updatedProduct)
  }
}

// @desc    deleting a product
// @route   PUT /api/products/admin
// @access  Private/Admin

exports.deleteProduct = async (req, res) => {
  const updatedProduct = await deleteDocument(req.product._id)
  if (!updatedProduct.error) {
    res.status(200).json({
      success: 'deletion of the product is succeess ful'
    })
  } else {
    res.status(400).json(updatedProduct)
  }
}

// @desc    Create a new review
// @route   POST / api/products/:id/reviews
// @access  Private

exports.createProductReview = async (req, res) => {
  console.log('hey')
  console.log('is it coming in the review')
  const reviewedProduct = await addReviewDocument(req)
  if (!reviewedProduct.error) {
    res.status(201).json(reviewedProduct)
  } else {
    res.status(412).json(reviewedProduct)
  }
}

// @desc    Get top rated products
// @route   GET / api/products/top
// @access  Public
exports.getTopProducts = async (req, res) => {
  const topProducts = await getTopDocuments()
  if (topProducts) {
    res.status(200).json(topProducts)
  } else {
    res.status(400).json({
      error: 'error loading top products'
    })
  }
}

// middleware

exports.getProductById = async (req, res, next, id) => {
  console.log('inside the getProductById', req.originalUrl)
  const productDB = await getDocumentById(id)
  console.log('getting the product inside the getProduct by id')
  if (!productDB) {
    return res.status(404).json({
      error: 'product not found in the database'
    })
  }
  if (!productDB.error) {
    console.log(
      'getting the product inside the getProduct by id inside if condition'
    )

    req.product = productDB
    console.log('req.product inside the getproduct by id', req.product)
    next()
  } else {
    res.status(409).json(productDB)
  }
}

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next()
}

// @desc    Get top rated products
// @route   GET / api/products/top
// @access  Public
// exports.getTopProducts = async (req, res) => {
//   const allProducts = await product.getAllDocuments()
//   const topProducts = allProducts
//     .sort({
//       rating: -1
//     })
//     .limit(3)
//   if (topProducts) {
//     res.status(200).json(topProducts)
//   } else {
//     res.status(400).json({
//       error: 'error loading top products'
//     })
//   }
// }

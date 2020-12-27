const express = require('express')
const { isSignedIn, isAdmin } = require('../middleware/authMiddleware')
// const { updateProduct } = require('../middleware/updateProduct')
// const { uploadProduct } = require('../middleware/uploadProduct')
const {
  getProductById,
  getAllProducts,
  getProduct,
  createProduct,
  createProductReview,
  deleteProduct,
  updateProduct,
  getTopProducts
} = require('./productController')
const router = express.Router()

router.param('productId', getProductById)

router.route('/').get(getAllProducts)
router.route('/top').get(getTopProducts)
router.route('/:productId/reviews').post(isSignedIn, createProductReview)

router
  .route('/:productId')
  .get(getProduct)
  .put(isSignedIn, isAdmin, updateProduct)
  .delete(isSignedIn, isAdmin, deleteProduct)

router.route('/admin/create').post(isSignedIn, isAdmin, createProduct)

module.exports = router

const express = require('express')
const { isSignedIn, isAdmin } = require('../middleware/authMiddleware')

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategory,
  updateCategory,
  deleteCategory
} = require('./categoryController')

const router = express.Router()

router.param('categoryId', getCategoryById)

router.route('/').get(getAllCategories)

router.post('/admin/', isSignedIn, isAdmin, createCategory)

router.route('/:categoryId').get(getCategory)

router
  .route('/admin/:categoryId')
  .put(isSignedIn, isAdmin, updateCategory)
  .delete(isSignedIn, isAdmin, deleteCategory)

module.exports = router

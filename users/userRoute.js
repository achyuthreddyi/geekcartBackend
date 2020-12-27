const express = require('express')
const { check } = require('express-validator')
const { isSignedIn, isAdmin } = require('../middleware/authMiddleware')
const {
  signOut,
  signUp,
  signIn,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  updateUserProfile,
  getUserProfile
} = require('./userController')

const router = express.Router()

// router.param('userId', getUserParam)

router.post(
  '/signup',
  [
    check('name')
      .isLength({ min: 3 })
      .withMessage('name must be at least 3 chars long'),
    check('email')
      .isEmail()
      .withMessage('must be a proper email '),
    check('password')
      .isLength({ min: 3 })
      .withMessage('password must be at least 3 chars long')
  ],
  signUp
)
router.post(
  '/signin',
  [
    check('password')
      .isLength({ min: 3 })
      .withMessage('password must be at least 3 chars long'),

    check('email')
      .isEmail()
      .withMessage('must be a proper email in the express ')
  ],
  signIn
)
router.get('/signout', signOut)
router
  .route('/profile')
  .get(isSignedIn, getUserProfile)
  .put(isSignedIn, updateUserProfile)

router
  .route('/:userId')
  .put(isSignedIn, isAdmin, updateUser)
  .delete(isSignedIn, isAdmin, deleteUser)
  .get(isSignedIn, isAdmin, getUser)

router.route('/admin/userlist').get(isSignedIn, isAdmin, getAllUsers)

module.exports = router

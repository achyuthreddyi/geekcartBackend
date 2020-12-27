const { validationResult } = require('express-validator')
const { generateToken } = require('../config/generateToken')
// const User = require('./userModel')
const {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  updateUserDocument,
  checkPassword,
  removeUser,
  getAllUsers
} = require('./userModel')

// controller functions
// @desc    register a new user
// @route   POST /api/users/
// @access  Public

exports.signUp = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    })
  }

  if (await getUserByEmail(req.body.email)) {
    return res.status(400).json({
      error: 'user already exits'
    })
  }
  // TODO: implemet the sign in

  const newUser = await createUser(req.body)
  if (!newUser.error) {
    res.status(201).json(newUser)
  } else {
    res.status(400).send(newUser)
  }
}

exports.signIn = async (req, res) => {
  const { email, password } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    })
  }

  const result = await checkPassword({ email, password })

  if (!result.error) {
    const payload = {
      _id: result._id
    }
    const token = generateToken(payload)
    const { _id, name, email, role } = result
    res.cookie('token', token, { expire: new Date() + 99999 })
    res.status(200).json({
      token,
      _id,
      name,
      email,
      role
    })
  } else {
    res.status(400).send(result)
  }
}

exports.signOut = (req, res) => {
  res.clearCookie('token')
  res.json({
    message: 'User Signout successfully'
  })
}

// @desc    update the user profile by the admin
// @route   PUT /api/users/id
// @access  Private/
exports.updateUser = async (req, res) => {
  const updatedUser = await updateUser(req)

  if (updatedUser.error) {
    res.status(400).json(updatedUser)
  } else {
    res.status(200).json(updatedUser)
  }
}
// @desc    update the user profile
// @route   GET /api/users/profile
// @access  Private/
exports.updateUserProfile = async (req, res) => {
  const newData = req.body

  console.log('in the update user profile ', newData)

  const updatedUser = await updateUserDocument(newData)
  const payload = {
    _id: updatedUser._id
  }
  updatedUser.token = generateToken(payload)

  if (!updatedUser.error) {
    res.status(200).json(updatedUser)
  } else {
    res.status(400).json(updatedUser)
  }
}

// @desc    get user profile
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res) => {
  const id = req.params.userId
  const userDB = await getUserById(id)
  if (!userDB.error) {
    return res.status(200).json(userDB)
  } else {
    return res.status(400).json(userDB)
  }
}

// @desc    delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  const id = req.params.userId
  console.log('user id in the delete method', id)
  const userExists = await getUserById(id)
  console.log('user exists in the delete user', userExists)

  if (userExists) {
    const deletedUser = await removeUser(userExists.email)
    if (!deletedUser.error) {
      res.status(200).json(deletedUser)
    } else {
      res.status(400).json(deletedUser)
    }
  } else {
    res.status(404).json({
      error: 'user does not exists in the database'
    })
  }
}

// @desc    get all users to the admin
// @route   GET /api/users/
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  console.log('getting in the userlist method')
  const userList = await getAllUsers()
  if (!userList.error) {
    res.status(200).json(userList)
  } else {
    res.status(400).json(userList)
  }
}

exports.getUserProfile = async (req, res) => {
  res.status(200).json(req.user)
}

// exports.getUserParam = async (req, res, next, id) => {
//   const fetchedUser = await user.getUserById(id)
//   console.log('fetched user ', fetchedUser)

//   if (!fetchedUser) {
//     res.status(400).json(fetchedUser)
//   } else {
//     req.profile = fetchedUser
//     next()
//   }
// }

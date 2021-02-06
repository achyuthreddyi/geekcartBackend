const jwt = require('jsonwebtoken')
const user = require('../users/userModel')

exports.isSignedIn = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // FIXME: optimize the code
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await user.getUserById(decoded._id)
      if (!req.user) {
        return res.status(401).json({
          error: 'user does not exits in the database'
        })
      }
      next()
    } catch (err) {
      res.status(400).json({
        error: 'Not authorized'
      })
    }
  } else {
    return res.status(401).json({
      error: 'No token '
    })
  }
}

exports.isAdmin = (req, res, next) => {
  if (req.user.role === 0) {
    return res.status(403).json({
      error: 'You are not an admin'
    })
  }
  next()
}

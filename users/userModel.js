const mongoose = require('mongoose')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 32,
      trim: true
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    userInfo: {
      type: String,
      trim: true
    },
    // TODO: hash the password
    hashed_password: {
      type: String,
      required: true
    },
    salt: String,
    role: {
      type: Number,
      default: 0
    }

    // purchases: {
    //   type: Array,
    //   default: []
    // }
  },
  { timestamps: true }
)

userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = uuidv4()
    this.hashed_password = this.securePassword(password)
  })
  .get(function () {
    return this._password
  })

userSchema.methods = {
  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.hashed_password
  },
  securePassword: function (plainPassword) {
    if (!plainPassword) {
      return ''
    } else {
      try {
        // FIXME: change this
        return crypto
          .createHmac('sha256', this.salt)
          .update(plainPassword)
          .digest('hex')
      } catch (err) {
        return ''
      }
    }
  }
}

const User = mongoose.model('User', userSchema)

exports.getUserById = async id => {
  console.log('coming in the model ', id)
  try {
    const userDB = await User.findById(id).select('-hashed_password -salt')

    console.log('user from the getuserbyid', userDB)
    return userDB
  } catch (err) {
    return {
      error: 'error getting the user by Id',
      err
    }
  }
}

exports.getUserByEmail = async email => {
  try {
    return await User.findOne({ email })
  } catch (err) {
    return {
      error: 'error getting the user by email',
      err
    }
  }
}

exports.createUser = async newUser => {
  try {
    return await User.create(newUser)
  } catch (err) {
    return {
      error: 'error creating the new user',
      err
    }
  }
}
// TODO: throw it in th controllers
exports.updateUser = async req => {
  try {
    const newdata = req.body
    console.log('req object in the update user tantanatan', newdata)
    const userDB = await User.findById(newdata._id)

    // const userDB = await User.updateOne(
    //   { _id: newdata._id },
    //   { name: newdata.name, email: newdata.email, role: newdata.role }
    // )
    console.log('userId in the update user', userDB)
    if (userDB) {
      userDB.name = newdata.name
      userDB.email = newdata.email
      userDB.role = newdata.role
      return await userDB.save()
    } else {
      return {
        error: ' user does not exists in our records'
      }
    }
    // return userDB
  } catch (err) {
    console.log('error while updating', err)
    return {
      error: 'user not being able to update  from the database',
      err
    }
  }
}

exports.updateUserDocument = async newData => {
  try {
    const email = newData.email

    const userDB = await User.findOne({ email }).select(
      '-hashed_password -salt'
    )
    if (userDB) {
      userDB.name = newData.name || userDB.name
      userDB.email = newData.email || userDB.email

      if (newData.password) {
        User.password = newData.password
      }
      return await userDB.save()
    } else {
      return {
        error: ' user does not exists in our records'
      }
    }
  } catch (err) {
    return {
      error: 'user not being able to update  from the database',
      err
    }
  }
}

exports.checkPassword = async userData => {
  const { email, password } = userData

  try {
    const userDB = await User.findOne({ email })
    if (!userDB.authenticate(password)) {
      return {
        error: 'user email and password did not match'
      }
    } else {
      return userDB
    }
  } catch (err) {
    return {
      error: 'user not being able to fetch from the database',
      err
    }
  }
}

exports.removeUser = async email => {
  console.log('user from the user model checking for the ', email)
  try {
    const userDB = await User.findOne({ email })
    return await userDB.remove()
  } catch (err) {
    return {
      error: 'error deleting the user from the database',
      err
    }
  }
}

exports.getAllUsers = async _ => {
  try {
    return await User.find()
  } catch (err) {
    return {
      error: 'Error loading all the users',
      err
    }
  }
}

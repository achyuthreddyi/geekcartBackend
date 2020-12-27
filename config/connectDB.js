const mongoose = require('mongoose')
require('colors')
const uri =
  'mongodb+srv://achyuth:achyuth@demo.xlnni.mongodb.net/geekcart?retryWrites=true&w=majority'
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log(`mongo db connected ${conn.connection.host}`.cyan.underline)
  } catch (err) {
    console.log(`error${err}`.red.underline.bold)
  }
}

module.exports = { connectDB }

require('dotenv').config()
const express = require('express')
const app = express()
const { connectDB } = require('./config/connectDB')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const userRoute = require('./users/userRoute')
const categoryRoute = require('./categories/categoryRoute')
const productRoute = require('./products/productRoute')
const orderRoute = require('./orders/orderRoute')
const morgan = require('morgan')
connectDB()

app.use(express.json())
app.use(cors())
app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Routes
app.use('/api/user', userRoute)
app.use('/api/category', categoryRoute)
app.use('/api/product', productRoute)
app.use('/api/orders', orderRoute)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`app working on port ${PORT}`))

// function errorHandler (err, req, res, next) {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode
//   res.status(statusCode).json({
//     message: err.message
//   })
// }

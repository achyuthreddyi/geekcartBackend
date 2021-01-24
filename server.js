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
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const { v4: uuidv4 } = require('uuid')

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

app.get('/api/config/stripe', (req, res) => {
  console.log('coming in the stripe config file')
  res.send(process.env.STRIPE_PRIVATE_KEY)
})

app.post('/api/config/payment', (req, res) => {
  const { order, token } = req.body
  console.log('PRODUCT', order)
  console.log('PRICE', order.totalprice)
  console.log('TOKEN', token)
  const idempotencyKey = uuidv4()

  return stripe.customers
    .create({
      email: token.email,
      source: token.id
    })
    .then(customer => {
      stripe.charges.create(
        {
          price: token.price,
          currency: 'inr',
          customer: customer.id,
          receipt_email: token.email,
          description: `purchase by ${order.user.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: order.shippingAddress.postalCode
            }
          }
        },
        { idempotencyKey }
      )
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log('error in the stripe payment', err))
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`app working on port ${PORT}`))

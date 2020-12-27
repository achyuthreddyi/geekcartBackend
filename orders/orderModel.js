const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        image: {
          type: String
          // required: true
        },
        price: {
          type: Number,
          required: true
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product'
        }
      }
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      required: true
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String }
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },
    paidAt: {
      type: Date
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false
    },
    deliveredAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

const Order = mongoose.model('Order', orderSchema)
// module.exports = Order

exports.createDocument = async req => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body
  console.log('inside the created document ')

  try {
    const newOrder = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    })
    const createdOrder = await newOrder.save()
    console.log('order created ', createdOrder)
    return createdOrder
  } catch (err) {
    return {
      error: 'error creating the new order',
      err
    }
  }
}
exports.getDocumentById = async id => {
  try {
    return await Order.findById(id).populate('user', 'name email')
  } catch (err) {
    return {
      error: 'error getting the product by id',
      err
    }
  }
}
exports.getDocumentsByUser = async id => {
  try {
    return await Order.find({ user: id })
  } catch (err) {
    return {
      error: 'error getting the user orders'
    }
  }
}

exports.getAllDocuments = async id => {
  try {
    return await Order.find().populate('user', 'name email')
  } catch (err) {
    return {
      error: 'error getting all the orders'
    }
  }
}
exports.updateDocumentToPaid = async req => {
  try {
    const order = await Order.findById(req.params.id)

    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address
      }
    }
    const updatedOrder = await order.save()
    return updatedOrder
  } catch (err) {
    return {
      error: 'could not update the payment status',
      err
    }
  }
}
exports.updateDocumentToDelivered = async req => {
  const order = await Order.findById(req.params.id)
  try {
    if (order) {
      order.isDelivered = true
      order.deliveredAt = Date.now()
      const updatedOrder = await order.save()
      return updatedOrder
    }
  } catch (err) {
    return {
      error: 'could not update the delivered status',
      err
    }
  }
}

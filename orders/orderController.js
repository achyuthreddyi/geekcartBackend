const {
  createDocument,
  getDocumentById,
  getDocumentsByUser,
  getAllDocuments,
  updateDocumentToPaid,
  updateDocumentToDelivered
} = require('./orderModel')
// @desc    create a new Order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  const createdOrder = await createDocument(req)
  if (!createdOrder.error) {
    console.log('inside the created order success')
    res.status(200).json(createdOrder)
  } else {
    console.log('inside the error in order creation')
    res.status(400).json(createdOrder)
  }
}
// @desc    get all orders to the admin
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  const createdOrder = await getAllDocuments()
  if (!createdOrder.error) {
    console.log('inside the created order success')
    res.status(200).json(createdOrder)
  } else {
    console.log('inside the error in order creation')
    res.status(400).json(createdOrder)
  }
}

// @desc    get logged in user's order
// @route   GET /api/orders/myOrders
// @access  Private
exports.getMyOrders = async (req, res) => {
  const order = await getDocumentsByUser(req.user._id)

  if (order) {
    res.status(200).json(order)
  } else {
    res.status(404).json(order)
  }
}

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  const order = await getDocumentById(req.params.id)
  if (order) {
    res.json(order)
  } else {
    res.status(404)
  }
}

// @desc    update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
  const updatedOrder = await updateDocumentToPaid(req)
  if (!updatedOrder.error) {
    return res.status(200).json(updatedOrder)
  } else {
    res.status(404)
  }
}

// @desc    update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = async (req, res) => {
  const updatedOrder = await updateDocumentToDelivered(req)
  if (!updatedOrder.error) {
    return res.status(200).json(updatedOrder)
  } else {
    res.status(404)
  }
}

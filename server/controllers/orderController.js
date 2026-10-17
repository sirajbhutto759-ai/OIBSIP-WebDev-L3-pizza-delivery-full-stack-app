const Order = require('../models/Order');
const Pizza = require('../models/Pizza');

const DELIVERY_FEE = 50;

// @desc   Place a new order
// @route  POST /api/orders
// @access Private (customer)
const placeOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item' });
    }

    if (
      !deliveryAddress ||
      !deliveryAddress.name ||
      !deliveryAddress.phone ||
      !deliveryAddress.address ||
      !deliveryAddress.city
    ) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required' });
    }

    // Server-side price recalculation — never trust frontend prices
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      if (!item.pizzaId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ success: false, message: 'Invalid item in order' });
      }

      const pizza = await Pizza.findById(item.pizzaId);
      if (!pizza) {
        return res.status(404).json({ success: false, message: `Pizza not found: ${item.pizzaId}` });
      }
      if (!pizza.isAvailable) {
        return res.status(400).json({ success: false, message: `"${pizza.name}" is currently unavailable` });
      }

      const qty = Math.max(1, Math.floor(Number(item.quantity)));
      subtotal += pizza.price * qty;

      orderItems.push({
        pizza: pizza._id,
        name: pizza.name,
        image: pizza.image,
        priceAtOrder: pizza.price,
        quantity: qty,
      });
    }

    const deliveryFee = DELIVERY_FEE;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      deliveryAddress: {
        name: deliveryAddress.name.trim(),
        phone: deliveryAddress.phone.trim(),
        address: deliveryAddress.address.trim(),
        city: deliveryAddress.city.trim(),
        instructions: deliveryAddress.instructions?.trim() || '',
      },
      subtotal,
      deliveryFee,
      total,
      paymentMethod: 'cash_on_delivery',
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc   Get logged-in customer's orders
// @route  GET /api/orders/my-orders
// @access Private (customer)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.pizza', 'name image');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single order (own orders only)
// @route  GET /api/orders/:id
// @access Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.pizza', 'name image');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Customers can only see their own orders; admins can see all
    if (req.user.role !== 'admin' && order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc   Get all orders (admin)
// @route  GET /api/admin/orders
// @access Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status && status !== 'All' ? { status } : {};
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('customer', 'name email phone')
      .populate('items.pizza', 'name image');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

// @desc   Update order status (admin)
// @route  PATCH /api/admin/orders/:id/status
// @access Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('customer', 'name email');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };

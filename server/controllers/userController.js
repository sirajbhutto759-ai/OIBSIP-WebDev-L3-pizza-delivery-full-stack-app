const User = require('../models/User');
const Order = require('../models/Order');
const Pizza = require('../models/Pizza');

// @desc   Get current user profile
// @route  GET /api/users/me
// @access Private
const getProfile = async (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

// @desc   Update current user profile (name and phone only)
// @route  PATCH /api/users/me
// @access Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (phone !== undefined) updateFields.phone = phone.trim();

    const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get admin dashboard stats
// @route  GET /api/admin/dashboard
// @access Admin
const getDashboard = async (req, res, next) => {
  try {
    const [totalOrders, totalCustomers, totalPizzas] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Pizza.countDocuments(),
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { status: { $in: ['Delivered', 'Confirmed', 'Preparing', 'Out for Delivery'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'name email');

    res.json({
      success: true,
      data: { totalOrders, totalCustomers, totalPizzas, totalRevenue, recentOrders },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get all customers (admin)
// @route  GET /api/admin/users
// @access Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, getDashboard, getAllUsers };

const Pizza = require('../models/Pizza');

// @desc   Get all available pizzas (with optional search/filter/sort)
// @route  GET /api/pizzas
// @access Public
const getPizzas = async (req, res, next) => {
  try {
    const { search, category, sort, showUnavailable } = req.query;
    const query = {};

    // Only admins can see unavailable pizzas
    if (showUnavailable !== 'true' || !req.user || req.user.role !== 'admin') {
      query.isAvailable = true;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };

    const pizzas = await Pizza.find(query).sort(sortObj);
    res.json({ success: true, count: pizzas.length, data: pizzas });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single pizza
// @route  GET /api/pizzas/:id
// @access Public
const getPizzaById = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found' });
    res.json({ success: true, data: pizza });
  } catch (err) {
    next(err);
  }
};

// @desc   Create pizza
// @route  POST /api/pizzas
// @access Admin
const createPizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.create(req.body);
    res.status(201).json({ success: true, data: pizza });
  } catch (err) {
    next(err);
  }
};

// @desc   Update pizza
// @route  PUT /api/pizzas/:id
// @access Admin
const updatePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found' });
    res.json({ success: true, data: pizza });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete pizza
// @route  DELETE /api/pizzas/:id
// @access Admin
const deletePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found' });
    res.json({ success: true, message: 'Pizza deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPizzas, getPizzaById, createPizza, updatePizza, deletePizza };

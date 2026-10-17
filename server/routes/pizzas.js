const express = require('express');
const {
  getPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
} = require('../controllers/pizzaController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPizzas);
router.get('/:id', getPizzaById);
router.post('/', protect, adminOnly, createPizza);
router.put('/:id', protect, adminOnly, updatePizza);
router.delete('/:id', protect, adminOnly, deletePizza);

module.exports = router;

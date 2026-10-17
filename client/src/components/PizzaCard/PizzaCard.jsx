import { Star, ShoppingCart, Leaf, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './PizzaCard.css';

const PizzaCard = ({ pizza }) => {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(pizza, 1);
    toast.success(`${pizza.name} added to cart! 🍕`);
  };

  return (
    <div className="pizza-card">
      <div className="pizza-card-image">
        <img src={pizza.image} alt={pizza.name} loading="lazy" />
        <div className="pizza-card-badges">
          {pizza.isVegetarian && (
            <span className="badge badge-veg"><Leaf size={11} /> Veg</span>
          )}
          {pizza.isSpicy && (
            <span className="badge badge-spicy"><Flame size={11} /> Spicy</span>
          )}
          {pizza.category === 'Premium' && (
            <span className="badge badge-premium">★ Premium</span>
          )}
        </div>
        <div className="pizza-card-category">{pizza.category}</div>
      </div>

      <div className="pizza-card-body">
        <div className="pizza-card-header">
          <h3 className="pizza-card-name">{pizza.name}</h3>
          <div className="pizza-rating">
            <Star size={14} fill="currentColor" />
            <span>{pizza.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="pizza-card-desc">{pizza.description}</p>
        <div className="pizza-card-footer">
          <span className="pizza-price">{formatPrice(pizza.price)}</span>
          <button className="btn btn-primary btn-sm pizza-add-btn" onClick={handleAdd}>
            <ShoppingCart size={15} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;

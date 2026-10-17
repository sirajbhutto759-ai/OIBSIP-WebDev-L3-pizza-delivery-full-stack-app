import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice, DELIVERY_FEE } from '../../utils/helpers';
import './CartPage.css';

const CartPage = () => {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const total = subtotal + DELIVERY_FEE;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <section className="page-hero">
          <div className="container"><h1>Your Cart</h1><p>Review and manage your order</p></div>
        </section>
        <div className="container">
          <div className="empty-state" style={{ paddingTop: 100 }}>
            <div className="empty-icon">🛒</div>
            <h3>Your Cart is Empty</h3>
            <p>Looks like you haven't added any pizzas yet.</p>
            <Link to="/menu" className="btn btn-primary btn-lg">
              <ShoppingBag size={18} /> Explore Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <section className="page-hero">
        <div className="container"><h1>Your Cart</h1><p>{items.length} item{items.length > 1 ? 's' : ''} ready to order</p></div>
      </section>

      <div className="container cart-container">
        <div className="cart-grid">
          {/* Items */}
          <div className="cart-items">
            <div className="cart-items-header">
              <h2>Order Items</h2>
              <button className="btn-clear-cart" onClick={clearCart}>
                <Trash2 size={15} /> Clear All
              </button>
            </div>

            {items.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <span className="cart-item-category">{item.category}</span>
                  <p className="cart-item-unit-price">{formatPrice(item.price)} each</p>
                </div>
                <div className="cart-item-qty">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-value" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="cart-item-total">
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>
                <button
                  className="cart-remove-btn"
                  onClick={() => removeItem(item._id)}
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <strong>{formatPrice(DELIVERY_FEE)}</strong>
                </div>
                <div className="summary-divider" />
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
              </div>

              <div className="summary-payment-note">
                <span>💵</span>
                <span>Cash on Delivery</span>
              </div>

              <Link to="/checkout" className="btn btn-primary btn-lg checkout-btn">
                Proceed to Checkout <ArrowRight size={18} />
              </Link>
              <Link to="/menu" className="btn btn-outline" style={{ width: '100%', marginTop: '12px', textAlign: 'center' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

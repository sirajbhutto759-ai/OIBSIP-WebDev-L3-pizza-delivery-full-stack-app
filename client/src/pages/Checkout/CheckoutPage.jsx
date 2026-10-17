import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Phone, User, FileText, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import { formatPrice, DELIVERY_FEE } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    instructions: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const total = subtotal + DELIVERY_FEE;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.address.trim()) e.address = 'Delivery address is required';
    if (!form.city.trim()) e.city = 'City is required';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ pizzaId: i._id, quantity: i.quantity })),
        deliveryAddress: form,
      };
      const { data } = await orderAPI.place(payload);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-confirmation/${data.data._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: 100 }}>
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some pizzas before checking out.</p>
            <Link to="/menu" className="btn btn-primary btn-lg">Go to Menu</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <section className="page-hero">
        <div className="container"><h1>Checkout</h1><p>Complete your delivery information</p></div>
      </section>

      <div className="container checkout-container">
        <div className="checkout-grid">
          {/* Delivery Form */}
          <div className="checkout-form-section">
            <h2>Delivery Information</h2>
            <form onSubmit={handleSubmit} noValidate className="checkout-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="name" className="form-label"><User size={14} /> Full Name</label>
                  <input id="name" name="name" type="text" value={form.name} onChange={handleChange} className={`form-input ${errors.name ? 'error' : ''}`} placeholder="John Doe" />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label"><Phone size={14} /> Phone Number</label>
                  <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="+92 300 1234567" />
                  {errors.phone && <p className="form-error">{errors.phone}</p>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label"><MapPin size={14} /> Delivery Address</label>
                <input id="address" name="address" type="text" value={form.address} onChange={handleChange} className={`form-input ${errors.address ? 'error' : ''}`} placeholder="House / Street / Area" />
                {errors.address && <p className="form-error">{errors.address}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="city" className="form-label">City</label>
                <input id="city" name="city" type="text" value={form.city} onChange={handleChange} className={`form-input ${errors.city ? 'error' : ''}`} placeholder="Karachi" />
                {errors.city && <p className="form-error">{errors.city}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="instructions" className="form-label"><FileText size={14} /> Delivery Instructions (optional)</label>
                <textarea id="instructions" name="instructions" value={form.instructions} onChange={handleChange} className="form-input" placeholder="E.g. Ring the bell, leave at door..." rows={3} style={{ resize: 'vertical' }} />
              </div>

              <div className="payment-note-box">
                <div className="payment-note-icon">💵</div>
                <div>
                  <strong>Cash on Delivery</strong>
                  <p>Please have the exact amount ready when your order arrives.</p>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg place-order-btn" disabled={loading}>
                {loading
                  ? <><div className="spinner spinner-sm" /> Placing order...</>
                  : <><ShoppingBag size={18} /> Place Order — {formatPrice(total)}</>}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <div className="summary-card">
              <h3>Your Order ({items.length} item{items.length > 1 ? 's' : ''})</h3>
              <div className="checkout-items">
                {items.map((item) => (
                  <div key={item._id} className="checkout-item">
                    <img src={item.image} alt={item.name} />
                    <div className="checkout-item-info">
                      <span>{item.name}</span>
                      <span className="checkout-item-qty">× {item.quantity}</span>
                    </div>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
              <div className="summary-divider" />
              <div className="summary-rows">
                <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
                <div className="summary-row"><span>Delivery Fee</span><strong>{formatPrice(DELIVERY_FEE)}</strong></div>
                <div className="summary-divider" />
                <div className="summary-row summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

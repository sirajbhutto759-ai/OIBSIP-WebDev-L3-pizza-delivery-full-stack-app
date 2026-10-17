import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ChevronRight, Clock, Bike, ShieldCheck, Flame, Leaf, Award } from 'lucide-react';
import { pizzaAPI } from '../../services/api';
import PizzaCard from '../../components/PizzaCard/PizzaCard';
import './HomePage.css';

const testimonials = [
  { id: 1, name: 'Ayesha Khan', location: 'Karachi', rating: 5, text: 'Best pizza in the city! The crust is perfectly crispy and the toppings are always fresh. Delivery was super fast too!', avatar: 'A' },
  { id: 2, name: 'Bilal Ahmed', location: 'Lahore', rating: 5, text: 'PizzaHub never disappoints. The Four Cheese Fiesta is absolutely divine. My whole family loves it!', avatar: 'B' },
  { id: 3, name: 'Sara Malik', location: 'Islamabad', rating: 5, text: 'Ordered the Truffle Mushroom Royale and it blew my mind. Premium quality at every bite. Highly recommend!', avatar: 'S' },
];

const categories = [
  { name: 'Classic', emoji: '🍕', desc: 'Timeless Italian favourites', color: '#fff3e0' },
  { name: 'Cheese Lovers', emoji: '🧀', desc: 'Rich, indulgent cheese blends', color: '#fce4ec' },
  { name: 'Vegetarian', emoji: '🥦', desc: 'Fresh garden ingredients', color: '#e8f5e9' },
  { name: 'Spicy', emoji: '🌶️', desc: 'Bold and fiery creations', color: '#fbe9e7' },
  { name: 'Premium', emoji: '👑', desc: 'Gourmet luxury toppings', color: '#fff8e1' },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pizzaAPI.getAll({ sort: 'rating' })
      .then(({ data }) => setFeatured(data.data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-overlay" />
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1400&q=80"
            alt="Delicious pizza"
            className="hero-img"
          />
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-tag">🍕 Fresh From the Oven</span>
            <h1>Hot, Fresh &amp; Delicious Pizza<br />Delivered to Your Door</h1>
            <p>Crafted with premium ingredients, baked to perfection, and delivered in 30 minutes. Experience the ultimate pizza delivery service in your city.</p>
            <div className="hero-actions">
              <Link to="/menu" className="btn btn-primary btn-lg">
                Order Now <ArrowRight size={20} />
              </Link>
              <Link to="/menu" className="btn btn-secondary btn-lg">
                Explore Menu
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><strong>500+</strong><span>Pizzas Sold Daily</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>4.9★</strong><span>Average Rating</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>30 min</strong><span>Avg. Delivery</span></div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-hint">↓</div>
      </section>

      {/* Features */}
      <section className="features-bar">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon" style={{ background: '#fee2e2' }}><Clock size={22} color="#E63946" /></div>
              <div><strong>30-Min Delivery</strong><p>Fresh and hot, guaranteed</p></div>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{ background: '#dcfce7' }}><Leaf size={22} color="#16a34a" /></div>
              <div><strong>Fresh Ingredients</strong><p>Locally sourced, daily fresh</p></div>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{ background: '#fef9c3' }}><Award size={22} color="#ca8a04" /></div>
              <div><strong>Award Winning</strong><p>Best Pizza of the Year 2024</p></div>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{ background: '#ede9fe' }}><ShieldCheck size={22} color="#7c3aed" /></div>
              <div><strong>Safe &amp; Hygienic</strong><p>HACCP certified kitchen</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Browse By</span>
            <h2>Popular Categories</h2>
            <p>Find your favourite style — from classic to gourmet</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link to={`/menu?category=${encodeURIComponent(cat.name)}`} key={cat.name} className="category-card" style={{ '--cat-color': cat.color }}>
                <div className="category-emoji">{cat.emoji}</div>
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
                <span className="category-arrow"><ChevronRight size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Top Picks</span>
            <h2>Our Most Loved Pizzas</h2>
            <p>Highest-rated by our customers — crafted with passion</p>
          </div>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="pizza-grid">
              {featured.map((pizza) => (
                <PizzaCard key={pizza._id} pizza={pizza} />
              ))}
            </div>
          )}
          <div className="section-cta">
            <Link to="/menu" className="btn btn-outline btn-lg">
              View Full Menu <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-inner">
            <div className="promo-text">
              <span className="promo-tag"><Flame size={16} /> Limited Offer</span>
              <h2>Get 20% Off Your First Order!</h2>
              <p>Sign up today and enjoy 20% off your very first pizza delivery. Use code <strong>WELCOME20</strong> at checkout.</p>
              <Link to="/register" className="btn btn-primary btn-lg">
                Claim Your Discount <ArrowRight size={18} />
              </Link>
            </div>
            <div className="promo-image">
              <img src="https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=500&q=80" alt="Special offer pizza" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Customer Love</span>
            <h2>What Our Customers Say</h2>
            <p>Real reviews from real pizza lovers</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Location */}
      <section className="section contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <span className="overline">Find Us</span>
              <h2>Visit Our Restaurant</h2>
              <p>Come experience our cozy dine-in atmosphere or simply order online for fast home delivery.</p>
              <div className="contact-details">
                <div className="contact-item">📍 <span>12 Pizza Street, Clifton, Karachi</span></div>
                <div className="contact-item">📞 <span>+92 300 1234567</span></div>
                <div className="contact-item">📧 <span>hello@pizzahub.pk</span></div>
                <div className="contact-item">🕐 <span>Mon–Fri: 10 AM – 12 AM | Sat–Sun: 10 AM – 2 AM</span></div>
              </div>
              <Link to="/contact" className="btn btn-primary" style={{ marginTop: '24px' }}>
                Contact Us <ArrowRight size={16} />
              </Link>
            </div>
            <div className="contact-map">
              <div className="map-placeholder">
                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80" alt="Restaurant interior" />
                <div className="map-overlay">
                  <span>🍕 PizzaHub Restaurant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

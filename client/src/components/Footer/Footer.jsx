import { Link } from 'react-router-dom';
import { Pizza, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="logo-icon"><Pizza size={20} /></div>
            Pizza<span>Hub</span>
          </Link>
          <p>Hot, fresh, and delicious pizzas delivered right to your doorstep. Made with love, served with passion.</p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/menu?category=Classic">Classic Pizzas</Link></li>
            <li><Link to="/menu?category=Cheese+Lovers">Cheese Lovers</Link></li>
            <li><Link to="/menu?category=Vegetarian">Vegetarian</Link></li>
            <li><Link to="/menu?category=Spicy">Spicy Pizzas</Link></li>
            <li><Link to="/menu?category=Premium">Premium</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul className="footer-contact">
            <li><MapPin size={15} /><span>12 Pizza Street, Karachi, Pakistan</span></li>
            <li><Phone size={15} /><span>+92 300 1234567</span></li>
            <li><Mail size={15} /><span>hello@pizzahub.pk</span></li>
          </ul>
          <div className="footer-hours">
            <strong>Opening Hours</strong>
            <p>Mon – Fri: 10:00 AM – 12:00 AM</p>
            <p>Sat – Sun: 10:00 AM – 2:00 AM</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} PizzaHub. All rights reserved.</p>
        <p>Made with ❤️ for pizza lovers</p>
      </div>
    </div>
  </footer>
);

export default Footer;

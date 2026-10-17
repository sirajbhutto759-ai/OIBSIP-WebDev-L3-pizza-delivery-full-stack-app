import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Pizza, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-icon"><Pizza size={22} /></div>
          <span>Pizza<span className="logo-accent">Hub</span></span>
        </Link>

        {/* Desktop Links */}
        <ul className="navbar-links">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/menu" className={({ isActive }) => isActive ? 'active' : ''}>Menu</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
        </ul>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn" aria-label="Cart">
            <ShoppingCart size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-menu-btn">
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <span className="user-name">{user.name.split(' ')[0]}</span>
              </button>
              <div className="user-dropdown">
                {isAdmin ? (
                  <Link to="/admin" className="dropdown-item" onClick={closeMenu}>
                    <LayoutDashboard size={15} /> Admin Panel
                  </Link>
                ) : (
                  <Link to="/dashboard" className="dropdown-item" onClick={closeMenu}>
                    <User size={15} /> My Dashboard
                  </Link>
                )}
                <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
        <NavLink to="/menu" onClick={closeMenu}>Menu</NavLink>
        <NavLink to="/about" onClick={closeMenu}>About</NavLink>
        <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
        <NavLink to="/cart" onClick={closeMenu} className="mobile-cart-link">
          <ShoppingCart size={18} /> Cart {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </NavLink>
        <div className="mobile-divider" />
        {user ? (
          <>
            {isAdmin ? (
              <NavLink to="/admin" onClick={closeMenu}><LayoutDashboard size={16} /> Admin Panel</NavLink>
            ) : (
              <NavLink to="/dashboard" onClick={closeMenu}><User size={16} /> My Dashboard</NavLink>
            )}
            <button className="mobile-logout" onClick={handleLogout}><LogOut size={16} /> Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary" onClick={closeMenu}>Login / Sign Up</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Pizza, ShoppingBag, Users, Store, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out from admin panel');
    navigate('/login');
  };

  return (
    <div className="admin-root">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="brand-logo">
            <Pizza size={24} />
          </div>
          <div className="brand-text">
            <span>Pizza<span className="brand-accent">Hub</span></span>
            <small className="admin-tag">ADMIN PORTAL</small>
          </div>
        </div>

        <nav className="admin-nav">
          <span className="nav-group-label">MAIN MENU</span>
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/pizzas" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Pizza size={18} />
            <span>Manage Pizzas</span>
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <ShoppingBag size={18} />
            <span>Manage Orders</span>
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Users size={18} />
            <span>Customers &amp; Users</span>
          </NavLink>

          <span className="nav-group-label" style={{ marginTop: 24 }}>STOREFRONT</span>
          <Link to="/" className="admin-nav-item storefront-link" target="_blank">
            <Store size={18} />
            <span>Live Store</span>
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-pill">
            <div className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-info">
              <strong className="admin-user-name">{user?.name}</strong>
              <span className="admin-role-badge">Administrator</span>
            </div>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-wrap">
        <header className="admin-topbar">
          <div className="topbar-welcome">
            <ShieldCheck size={20} className="topbar-icon" />
            <span>PizzaHub Control Center</span>
          </div>

          <div className="topbar-actions">
            <Link to="/" className="btn btn-outline btn-sm">
              <Store size={14} /> View Store
            </Link>
          </div>
        </header>

        <main className="admin-content-inner">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, User, Clock, Phone, MapPin, ChevronRight, ShoppingBag, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { orderAPI, userAPI } from '../../services/api';
import { formatPrice, formatDateTime, getStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data } = await orderAPI.myOrders();
      setOrders(data.data || []);
    } catch (err) {
      toast.error('Failed to load your orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setSavingProfile(true);
    try {
      const { data } = await userAPI.updateMe(profileForm);
      updateUser(data.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleReorder = (order) => {
    let count = 0;
    order.items.forEach((item) => {
      // Re-add items to cart
      addToCart(
        {
          _id: item.pizza?._id || item.pizzaId || item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size || 'Medium',
        },
        item.quantity
      );
      count += item.quantity;
    });
    toast.success(`Added ${count} items to cart!`);
    navigate('/cart');
  };

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);
  const activeOrdersCount = orders.filter(
    (o) => {
      const s = o.status || o.orderStatus;
      return s !== 'Delivered' && s !== 'Cancelled';
    }
  ).length;

  return (
    <div className="dashboard-page">
      <section className="page-hero">
        <div className="container">
          <div className="dashboard-hero-content">
            <div className="user-profile-avatar-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1>Welcome back, {user?.name}!</h1>
              <p>{user?.email} • Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container dashboard-container">
        {/* Metric Cards */}
        <div className="dashboard-stats-grid">
          <div className="card stat-card">
            <div className="stat-icon stat-icon-orders"><Package size={24} /></div>
            <div>
              <span className="stat-label">Total Orders</span>
              <strong className="stat-val">{orders.length}</strong>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon stat-icon-active"><Clock size={24} /></div>
            <div>
              <span className="stat-label">Active Orders</span>
              <strong className="stat-val">{activeOrdersCount}</strong>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon stat-icon-spent"><ShoppingBag size={24} /></div>
            <div>
              <span className="stat-label">Total Spent</span>
              <strong className="stat-val">{formatPrice(totalSpent)}</strong>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={18} /> My Orders ({orders.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> Account Details
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="dashboard-tab-content">
            {loadingOrders ? (
              <div className="loading-center">
                <div className="spinner" />
              </div>
            ) : orders.length === 0 ? (
              <div className="card empty-state">
                <div className="empty-icon">🍕</div>
                <h3>No Orders Yet</h3>
                <p>You haven't placed any delicious pizza orders yet.</p>
                <Link to="/menu" className="btn btn-primary btn-lg">Browse Menu</Link>
              </div>
            ) : (
              <div className="orders-stack">
                {orders.map((order) => {
                  const s = order.status || order.orderStatus || 'Pending';
                  const tot = order.total || order.totalAmount || 0;
                  const orderNum = order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`;
                  return (
                    <div key={order._id} className="card order-card">
                      <div className="order-card-header">
                        <div>
                          <div className="order-card-id">
                            Order <strong>{orderNum}</strong>
                          </div>
                          <div className="order-card-date">
                            {formatDateTime(order.createdAt)}
                          </div>
                        </div>
                        <div className="order-card-header-right">
                          <span className={`status-badge ${getStatusColor(s)}`}>
                            {s}
                          </span>
                          <Link
                            to={`/order-confirmation/${order._id}`}
                            className="btn btn-outline btn-sm track-btn"
                          >
                            Track Order <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>

                      <div className="order-card-body">
                        <div className="order-items-preview">
                          {order.items.map((item, idx) => {
                            const p = item.priceAtOrder || item.price || 0;
                            return (
                              <div key={idx} className="preview-item">
                                <img
                                  src={item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&q=80'}
                                  alt={item.name}
                                />
                                <div className="preview-item-info">
                                  <span className="name">{item.name}</span>
                                  <span className="qty">Qty: {item.quantity}</span>
                                </div>
                                <span className="price">{formatPrice(p * item.quantity)}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="order-card-footer">
                          <div className="order-address-snippet">
                            <MapPin size={15} />
                            <span>{order.deliveryAddress?.address}, {order.deliveryAddress?.city}</span>
                          </div>
                          <div className="order-footer-actions">
                            <div className="order-total-block">
                              <span>Total</span>
                              <strong>{formatPrice(tot)}</strong>
                            </div>
                            <button
                              onClick={() => handleReorder(order)}
                              className="btn btn-dark btn-sm reorder-btn"
                            >
                              <RefreshCw size={14} /> Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Profile Details Tab */}
        {activeTab === 'profile' && (
          <div className="dashboard-tab-content">
            <div className="card profile-card">
              <h3>Personal Information</h3>
              <p className="card-subtitle">Manage your contact information and delivery preferences.</p>

              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (Read-only)</label>
                  <input
                    type="email"
                    className="form-input"
                    value={user?.email || ''}
                    disabled
                    style={{ background: 'var(--gray-100)', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: 'var(--text-light)', marginTop: 4, display: 'block' }}>
                    Email cannot be modified directly for account security.
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+92 300 1234567"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                    {savingProfile ? (
                      <><div className="spinner spinner-sm" /> Saving Changes...</>
                    ) : (
                      'Save Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

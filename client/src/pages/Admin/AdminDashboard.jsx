import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, ShoppingBag, Users, Pizza, TrendingUp, Clock, 
  ArrowRight, PlusCircle, CheckCircle, RefreshCw 
} from 'lucide-react';
import { userAPI, orderAPI } from '../../services/api';
import { formatPrice, formatDateTime, getStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.dashboard();
      setStats(data.data);
    } catch (err) {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success(`Order status updated to "${newStatus}"`);
      // Update local state
      setStats((prev) => ({
        ...prev,
        recentOrders: prev.recentOrders.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        ),
      }));
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  if (loading && !stats) {
    return (
      <div className="admin-loading-wrap">
        <div className="spinner" />
      </div>
    );
  }

  const { totalOrders = 0, totalCustomers = 0, totalPizzas = 0, totalRevenue = 0, recentOrders = [] } = stats || {};

  return (
    <div className="admin-dashboard-page">
      <div className="admin-page-header">
        <div>
          <h2>Analytics &amp; Operations Overview</h2>
          <p className="admin-page-desc">Track real-time orders, store revenue, and kitchen activity.</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchDashboard} className="btn btn-outline btn-sm" title="Refresh data">
            <RefreshCw size={14} /> Refresh
          </button>
          <Link to="/admin/pizzas" className="btn btn-primary btn-sm">
            <PlusCircle size={15} /> Add New Pizza
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="admin-stats-grid">
        <div className="card admin-stat-card">
          <div className="admin-stat-icon revenue-icon">
            <DollarSign size={24} />
          </div>
          <div className="admin-stat-info">
            <span className="stat-title">Total Revenue</span>
            <strong className="stat-number">{formatPrice(totalRevenue)}</strong>
            <span className="stat-badge-trend positive">
              <TrendingUp size={12} /> Active Earnings
            </span>
          </div>
        </div>

        <div className="card admin-stat-card">
          <div className="admin-stat-icon orders-icon">
            <ShoppingBag size={24} />
          </div>
          <div className="admin-stat-info">
            <span className="stat-title">Total Orders</span>
            <strong className="stat-number">{totalOrders}</strong>
            <span className="stat-badge-trend neutral">All-time Orders</span>
          </div>
        </div>

        <div className="card admin-stat-card">
          <div className="admin-stat-icon customers-icon">
            <Users size={24} />
          </div>
          <div className="admin-stat-info">
            <span className="stat-title">Customers</span>
            <strong className="stat-number">{totalCustomers}</strong>
            <span className="stat-badge-trend neutral">Registered Accounts</span>
          </div>
        </div>

        <div className="card admin-stat-card">
          <div className="admin-stat-icon pizzas-icon">
            <Pizza size={24} />
          </div>
          <div className="admin-stat-info">
            <span className="stat-title">Active Pizzas</span>
            <strong className="stat-number">{totalPizzas}</strong>
            <span className="stat-badge-trend neutral">Menu Items</span>
          </div>
        </div>
      </div>

      {/* Quick Operations Bar */}
      <div className="admin-quick-bar card">
        <div className="quick-bar-title">Quick Operations</div>
        <div className="quick-bar-buttons">
          <Link to="/admin/orders?status=Pending" className="quick-pill">
            <Clock size={15} /> Pending Orders
          </Link>
          <Link to="/admin/orders" className="quick-pill">
            <ShoppingBag size={15} /> All Orders
          </Link>
          <Link to="/admin/pizzas" className="quick-pill">
            <Pizza size={15} /> Edit Pizza Menu
          </Link>
          <Link to="/admin/users" className="quick-pill">
            <Users size={15} /> Customer Directory
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="card admin-table-card">
        <div className="table-header-row">
          <div>
            <h3>Recent Orders</h3>
            <p>Latest customer requests needing processing and fulfillment.</p>
          </div>
          <Link to="/admin/orders" className="btn btn-outline btn-sm">
            View All Orders <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 0' }}>
            <div className="empty-icon">📦</div>
            <p>No recent orders found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date &amp; Time</th>
                  <th>Current Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const s = order.status || order.orderStatus || 'Pending';
                  const tot = order.total || order.totalAmount || 0;
                  const orderNum = order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`;
                  return (
                    <tr key={order._id}>
                      <td>
                        <strong className="order-mono-id">{orderNum}</strong>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <strong>{order.customer?.name || order.deliveryAddress?.name || 'Guest Customer'}</strong>
                          <span>{order.customer?.email || order.deliveryAddress?.phone}</span>
                        </div>
                      </td>
                      <td>
                        <span className="items-count-badge">
                          {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                        </span>
                      </td>
                      <td>
                        <strong className="price-text">{formatPrice(tot)}</strong>
                      </td>
                      <td>
                        <span className="date-text">{formatDateTime(order.createdAt)}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusColor(s)}`}>
                          {s}
                        </span>
                      </td>
                      <td>
                        <select
                          className="status-select-sm"
                          value={s}
                          onChange={(e) => handleQuickStatusChange(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

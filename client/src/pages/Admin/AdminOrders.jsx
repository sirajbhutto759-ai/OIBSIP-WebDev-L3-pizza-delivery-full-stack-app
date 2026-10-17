import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, X, Clock, MapPin, Phone, User, Eye, 
  ChevronRight, Filter, RefreshCw 
} from 'lucide-react';
import { orderAPI } from '../../services/api';
import { formatPrice, formatDateTime, getStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './AdminOrders.css';

const STATUS_TABS = [
  'All',
  'Pending',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = selectedStatus !== 'All' ? { status: selectedStatus } : {};
      const { data } = await orderAPI.adminAll(params);
      setOrders(data.data || []);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success(`Order updated to "${newStatus}"`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const sTerm = searchTerm.toLowerCase();
    const orderNum = (o.orderNumber || o._id).toLowerCase();
    const custName = (o.customer?.name || o.deliveryAddress?.name || '').toLowerCase();
    const custPhone = (o.customer?.phone || o.deliveryAddress?.phone || '').toLowerCase();
    return orderNum.includes(sTerm) || custName.includes(sTerm) || custPhone.includes(sTerm);
  });

  return (
    <div className="admin-orders-page">
      <div className="admin-page-header">
        <div>
          <h2>Orders &amp; Kitchen Dispatch</h2>
          <p className="admin-page-desc">Monitor live customer orders and update dispatch statuses.</p>
        </div>
        <button onClick={fetchOrders} className="btn btn-outline btn-sm">
          <RefreshCw size={14} /> Refresh Orders
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="card admin-filter-bar">
        <div className="admin-status-tabs">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              className={`status-tab-btn ${selectedStatus === tab ? 'active' : ''}`}
              onClick={() => setSelectedStatus(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="admin-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by order ID, customer, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card admin-table-card">
        {loading ? (
          <div className="admin-loading-wrap">
            <div className="spinner" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 0' }}>
            <div className="empty-icon">📦</div>
            <h3>No Orders Found</h3>
            <p>There are no orders matching the selected status or search filter.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer &amp; Contact</th>
                  <th>Destination</th>
                  <th>Items Ordered</th>
                  <th>Total</th>
                  <th>Date &amp; Time</th>
                  <th>Status Selector</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
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
                          <strong>{order.deliveryAddress?.name || order.customer?.name || 'Customer'}</strong>
                          <span>{order.deliveryAddress?.phone || order.customer?.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="address-cell">
                          <span>{order.deliveryAddress?.address}</span>
                          <small>{order.deliveryAddress?.city}</small>
                        </div>
                      </td>
                      <td>
                        <div className="items-summary-cell">
                          <strong>{order.items?.length || 0} items</strong>
                          <small>
                            {order.items?.map((i) => `${i.name} (×${i.quantity})`).slice(0, 2).join(', ')}
                            {(order.items?.length || 0) > 2 ? '...' : ''}
                          </small>
                        </div>
                      </td>
                      <td>
                        <strong className="price-text">{formatPrice(tot)}</strong>
                      </td>
                      <td>
                        <span className="date-text">{formatDateTime(order.createdAt)}</span>
                      </td>
                      <td>
                        <select
                          className={`status-select-sm status-border-${s.replace(/\s+/g, '')}`}
                          value={s}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="action-icon-btn view-btn"
                          title="View Full Details"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Order Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal card order-detail-modal">
            <div className="modal-header">
              <div>
                <h3>Order {selectedOrder.orderNumber || `#${selectedOrder._id.slice(-8).toUpperCase()}`}</h3>
                <span className="modal-sub">Placed on {formatDateTime(selectedOrder.createdAt)}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-content">
              {/* Status Section */}
              <div className="detail-status-bar">
                <span>Current Status:</span>
                <span className={`status-badge ${getStatusColor(selectedOrder.status || selectedOrder.orderStatus)}`}>
                  {selectedOrder.status || selectedOrder.orderStatus}
                </span>
                <select
                  className="status-select-sm"
                  value={selectedOrder.status || selectedOrder.orderStatus}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  style={{ marginLeft: 'auto' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Delivery Info */}
              <div className="detail-section">
                <h4>Delivery Recipient</h4>
                <div className="detail-info-grid">
                  <div>
                    <strong>Customer Name:</strong> {selectedOrder.deliveryAddress?.name}
                  </div>
                  <div>
                    <strong>Phone:</strong> {selectedOrder.deliveryAddress?.phone}
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <strong>Address:</strong> {selectedOrder.deliveryAddress?.address}, {selectedOrder.deliveryAddress?.city}
                  </div>
                  {selectedOrder.deliveryAddress?.instructions && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <strong>Instructions:</strong> <em>"{selectedOrder.deliveryAddress.instructions}"</em>
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="detail-section">
                <h4>Items Ordered ({selectedOrder.items?.length})</h4>
                <div className="detail-items-list">
                  {selectedOrder.items?.map((item, idx) => {
                    const price = item.priceAtOrder || item.price || 0;
                    return (
                      <div key={idx} className="detail-item-row">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&q=80'}
                          alt={item.name}
                        />
                        <div className="detail-item-name">
                          <strong>{item.name}</strong>
                          <span>Quantity: {item.quantity}</span>
                        </div>
                        <div className="detail-item-cost">
                          {formatPrice(price * item.quantity)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="detail-total-box">
                <div className="detail-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder.subtotal || ((selectedOrder.total || selectedOrder.totalAmount) - 50))}</span>
                </div>
                <div className="detail-row">
                  <span>Delivery Fee:</span>
                  <span>{formatPrice(selectedOrder.deliveryFee || 50)}</span>
                </div>
                <div className="detail-divider" />
                <div className="detail-row total-row">
                  <span>Total Due:</span>
                  <span>{formatPrice(selectedOrder.total || selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: 24 }}>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-dark">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

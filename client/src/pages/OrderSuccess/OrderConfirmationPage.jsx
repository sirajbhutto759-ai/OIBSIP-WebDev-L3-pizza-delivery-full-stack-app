import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, Phone, Package, ChevronRight, Home, ShoppingBag } from 'lucide-react';
import { orderAPI } from '../../services/api';
import { formatPrice, formatDateTime, getStatusColor } from '../../utils/helpers';
import './OrderConfirmationPage.css';

const steps = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    orderAPI.getById(id)
      .then(({ data }) => setOrder(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="order-confirm-page">
        <div className="container loading-center" style={{ minHeight: '60vh' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-confirm-page">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: 80 }}>
            <div className="empty-icon">⚠️</div>
            <h3>Order Not Found</h3>
            <p>{error || 'We could not find the details for this order.'}</p>
            <Link to="/menu" className="btn btn-primary">Back to Menu</Link>
          </div>
        </div>
      </div>
    );
  }

  const orderStatus = order.status || order.orderStatus || 'Pending';
  const orderTotal = order.total || order.totalAmount || 0;
  const orderIdDisplay = order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`;
  const currentStepIdx = steps.indexOf(orderStatus);

  return (
    <div className="order-confirm-page">
      <div className="order-confirm-hero">
        <div className="container">
          <div className="success-badge-icon">
            <CheckCircle2 size={48} />
          </div>
          <h1>Order Placed Successfully!</h1>
          <p className="order-subtitle">
            Thank you for ordering with PizzaHub. Your hot &amp; fresh pizza is in the works!
          </p>
          <div className="order-id-tag">
            Order ID: <span>{orderIdDisplay}</span>
          </div>
        </div>
      </div>

      <div className="container order-confirm-content">
        {/* Status Tracker */}
        <div className="card status-tracker-card">
          <div className="tracker-header">
            <div>
              <h3>Order Status: <span className={`status-badge ${getStatusColor(orderStatus)}`}>{orderStatus}</span></h3>
              <p className="eta-text">
                <Clock size={16} /> Estimated Delivery: <strong>30–40 Minutes</strong>
              </p>
            </div>
            <div className="order-placed-time">
              Placed on {formatDateTime(order.createdAt)}
            </div>
          </div>

          <div className="timeline-wrapper">
            <div className="timeline-steps">
              {steps.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                return (
                  <div key={step} className={`timeline-step ${isPassed ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}>
                    <div className="timeline-node">
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <span className="timeline-label">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="order-details-grid">
          {/* Order Items */}
          <div className="card order-items-card">
            <h3>Items in Your Order</h3>
            <div className="items-list">
              {order.items.map((item, index) => {
                const price = item.priceAtOrder || item.price || 0;
                return (
                  <div key={index} className="order-item-row">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80'}
                      alt={item.name}
                      className="order-item-thumb"
                    />
                    <div className="order-item-info">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-size">{item.size || 'Medium'} • Qty: {item.quantity}</span>
                    </div>
                    <div className="order-item-price">
                      {formatPrice(price * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="order-bill-summary">
              <div className="bill-row">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal || (orderTotal - (order.deliveryFee || 50)))}</span>
              </div>
              <div className="bill-row">
                <span>Delivery Fee</span>
                <span>{formatPrice(order.deliveryFee || 50)}</span>
              </div>
              <div className="bill-divider" />
              <div className="bill-row bill-total">
                <span>Total Amount</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="card delivery-info-card">
            <h3>Delivery &amp; Payment</h3>
            <div className="info-group">
              <div className="info-label"><MapPin size={16} /> Destination</div>
              <p className="info-value">
                <strong>{order.deliveryAddress?.name}</strong><br />
                {order.deliveryAddress?.address}<br />
                {order.deliveryAddress?.city}
              </p>
            </div>

            <div className="info-group">
              <div className="info-label"><Phone size={16} /> Contact Number</div>
              <p className="info-value">{order.deliveryAddress?.phone}</p>
            </div>

            {order.deliveryAddress?.instructions && (
              <div className="info-group">
                <div className="info-label">Special Instructions</div>
                <p className="info-value info-instructions">"{order.deliveryAddress.instructions}"</p>
              </div>
            )}

            <div className="info-group">
              <div className="info-label">Payment Method</div>
              <div className="payment-pill">
                <span className="payment-icon">💵</span>
                <div>
                  <strong>Cash on Delivery (COD)</strong>
                  <p>Pay {formatPrice(orderTotal)} upon arrival</p>
                </div>
              </div>
            </div>

            <div className="confirm-actions">
              <Link to="/dashboard" className="btn btn-outline btn-block">
                <Package size={16} /> View All My Orders
              </Link>
              <Link to="/menu" className="btn btn-primary btn-block">
                <ShoppingBag size={16} /> Order More Pizza
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;

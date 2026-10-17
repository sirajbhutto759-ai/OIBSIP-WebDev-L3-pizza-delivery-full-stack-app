export const formatPrice = (amount) =>
  `Rs. ${Number(amount).toLocaleString('en-PK')}`;

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

export const formatDateTime = (dateString) =>
  new Date(dateString).toLocaleString('en-PK', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export const getStatusColor = (status) => {
  const map = {
    Pending: 'status-Pending',
    Confirmed: 'status-Confirmed',
    Preparing: 'status-Preparing',
    'Out for Delivery': 'status-OutforDelivery',
    Delivered: 'status-Delivered',
    Cancelled: 'status-Cancelled',
  };
  return map[status] || '';
};

export const DELIVERY_FEE = 50;

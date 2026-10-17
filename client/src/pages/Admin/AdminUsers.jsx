import { useState, useEffect } from 'react';
import { Users, Search, X, Mail, Phone, Calendar, ShieldCheck, RefreshCw } from 'lucide-react';
import { userAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.allUsers();
      setUsers(data.data || []);
    } catch (err) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const phone = (u.phone || '').toLowerCase();
    return name.includes(term) || email.includes(term) || phone.includes(term);
  });

  return (
    <div className="admin-users-page">
      <div className="admin-page-header">
        <div>
          <h2>Registered Customers Directory</h2>
          <p className="admin-page-desc">View registered customer profiles and account details.</p>
        </div>
        <button onClick={fetchUsers} className="btn btn-outline btn-sm">
          <RefreshCw size={14} /> Refresh List
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="card admin-filter-bar">
        <div className="admin-search-box" style={{ maxWidth: 450 }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>
        <div className="users-count-tag">
          Total Customers: <strong>{users.length}</strong>
        </div>
      </div>

      {/* Users Table */}
      <div className="card admin-table-card">
        {loading ? (
          <div className="admin-loading-wrap">
            <div className="spinner" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 0' }}>
            <div className="empty-icon">👥</div>
            <h3>No Customers Found</h3>
            <p>No registered accounts match your search query.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Account Role</th>
                  <th>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-profile-cell">
                        <div className="user-table-avatar">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong className="user-table-name">{u.name}</strong>
                          <span className="user-table-id">ID: {u._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="user-email-cell">
                        <Mail size={13} />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="user-phone-cell">
                        <Phone size={13} />
                        <span>{u.phone || '—'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="role-pill customer-pill">
                        Customer
                      </span>
                    </td>
                    <td>
                      <div className="user-date-cell">
                        <Calendar size={13} />
                        <span>{formatDate(u.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

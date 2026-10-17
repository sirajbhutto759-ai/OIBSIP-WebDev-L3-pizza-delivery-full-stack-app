import { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Check, X, Pizza, AlertTriangle, 
  ToggleLeft, ToggleRight, Sparkles 
} from 'lucide-react';
import { pizzaAPI } from '../../services/api';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './AdminPizzas.css';

const CATEGORIES = ['All', 'Classic', 'Cheese Lovers', 'Vegetarian', 'Spicy', 'Premium'];

const initialFormState = {
  name: '',
  category: 'Classic',
  price: '',
  description: '',
  image: '',
  size: 'Medium',
  rating: 4.5,
  isVeg: false,
  isSpicy: false,
  isPopular: false,
  isAvailable: true,
};

const AdminPizzas = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPizza, setEditingPizza] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    setLoading(true);
    try {
      const { data } = await pizzaAPI.getAll();
      setPizzas(data.data || []);
    } catch (err) {
      toast.error('Failed to load pizzas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingPizza(null);
    setFormData(initialFormState);
    setModalOpen(true);
  };

  const handleOpenEditModal = (pizza) => {
    setEditingPizza(pizza);
    setFormData({
      name: pizza.name,
      category: pizza.category || 'Classic',
      price: pizza.price,
      description: pizza.description || '',
      image: pizza.image || '',
      size: pizza.size || 'Medium',
      rating: pizza.rating || 4.5,
      isVeg: Boolean(pizza.isVeg || pizza.isVegetarian),
      isVegetarian: Boolean(pizza.isVeg || pizza.isVegetarian),
      isSpicy: Boolean(pizza.isSpicy),
      isPopular: Boolean(pizza.isPopular),
      isAvailable: pizza.isAvailable !== false,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingPizza(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.description.trim()) {
      toast.error('Name, price, and description are required');
      return;
    }

    const isVegVal = Boolean(formData.isVeg || formData.isVegetarian);
    const payload = {
      ...formData,
      isVeg: isVegVal,
      isVegetarian: isVegVal,
      price: Number(formData.price),
      rating: Number(formData.rating) || 4.5,
    };

    setSubmitting(true);
    try {
      if (editingPizza) {
        const { data } = await pizzaAPI.update(editingPizza._id, payload);
        toast.success(`"${data.data.name}" updated successfully!`);
        setPizzas((prev) => prev.map((p) => (p._id === editingPizza._id ? data.data : p)));
      } else {
        const { data } = await pizzaAPI.create(payload);
        toast.success(`"${data.data.name}" created successfully!`);
        setPizzas((prev) => [data.data, ...prev]);
      }
      handleCloseModal();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailability = async (pizza) => {
    const updatedStatus = !pizza.isAvailable;
    try {
      await pizzaAPI.update(pizza._id, { isAvailable: updatedStatus });
      toast.success(
        `"${pizza.name}" is now ${updatedStatus ? 'Available' : 'Unavailable'}`
      );
      setPizzas((prev) =>
        prev.map((p) => (p._id === pizza._id ? { ...p, isAvailable: updatedStatus } : p))
      );
    } catch (err) {
      toast.error(err.message || 'Failed to update availability');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await pizzaAPI.delete(deleteTarget._id);
      toast.success(`"${deleteTarget.name}" deleted successfully`);
      setPizzas((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete pizza');
    }
  };

  const filteredPizzas = pizzas.filter((pizza) => {
    const matchesSearch =
      pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pizza.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === 'All' || pizza.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="admin-pizzas-page">
      <div className="admin-page-header">
        <div>
          <h2>Menu &amp; Pizza Management</h2>
          <p className="admin-page-desc">Create, modify, toggle stock availability, or delete pizzas.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary btn-sm">
          <Plus size={16} /> Add New Pizza
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card admin-filter-bar">
        <div className="admin-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search pizza by name or ingredient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="admin-cat-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pizzas List */}
      <div className="card admin-table-card">
        {loading ? (
          <div className="admin-loading-wrap">
            <div className="spinner" />
          </div>
        ) : filteredPizzas.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 0' }}>
            <div className="empty-icon">🍕</div>
            <h3>No Pizzas Found</h3>
            <p>Try clearing your search query or add a brand-new pizza.</p>
            <button onClick={handleOpenAddModal} className="btn btn-primary btn-sm">
              <Plus size={14} /> Add Pizza Now
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pizza</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Tags</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPizzas.map((pizza) => (
                  <tr key={pizza._id} className={!pizza.isAvailable ? 'row-disabled' : ''}>
                    <td>
                      <div className="pizza-cell">
                        <img
                          src={pizza.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&q=80'}
                          alt={pizza.name}
                          className="pizza-thumb"
                        />
                        <div>
                          <strong className="pizza-name-text">{pizza.name}</strong>
                          <span className="pizza-desc-text">{pizza.description?.slice(0, 50)}...</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="cat-badge">{pizza.category || 'Classic'}</span>
                    </td>
                    <td>
                      <strong className="price-text">{formatPrice(pizza.price)}</strong>
                    </td>
                    <td>
                      <div className="tags-cluster">
                        {(pizza.isVeg || pizza.isVegetarian) && <span className="badge badge-veg">Veg</span>}
                        {pizza.isSpicy && <span className="badge badge-spicy">Spicy</span>}
                        {pizza.isPopular && <span className="badge badge-premium">Popular</span>}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleAvailability(pizza)}
                        className={`toggle-stock-btn ${pizza.isAvailable ? 'in-stock' : 'out-stock'}`}
                        title="Click to toggle availability"
                      >
                        {pizza.isAvailable ? (
                          <><Check size={14} /> Available</>
                        ) : (
                          <><X size={14} /> Sold Out</>
                        )}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          onClick={() => handleOpenEditModal(pizza)}
                          className="action-icon-btn edit-btn"
                          title="Edit Pizza"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(pizza)}
                          className="action-icon-btn delete-btn"
                          title="Delete Pizza"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Pizza Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal card">
            <div className="modal-header">
              <h3>{editingPizza ? 'Edit Pizza' : 'Add New Pizza'}</h3>
              <button onClick={handleCloseModal} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Pizza Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. Truffle Mushroom Feast"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="Classic">Classic</option>
                    <option value="Cheese Lovers">Cheese Lovers</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Spicy">Spicy</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Price (PKR) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. 1450"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Base Size</label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="Small">Small (8")</option>
                    <option value="Medium">Medium (11")</option>
                    <option value="Large">Large (14")</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input"
                  rows={3}
                  placeholder="Fresh mozzarella, hand-picked mushrooms, truffle drizzle..."
                  required
                />
              </div>

              {/* Checkboxes */}
              <div className="modal-checkboxes-grid">
                <label className="modal-checkbox">
                  <input
                    type="checkbox"
                    name="isVeg"
                    checked={formData.isVeg}
                    onChange={handleInputChange}
                  />
                  <span>Vegetarian</span>
                </label>
                <label className="modal-checkbox">
                  <input
                    type="checkbox"
                    name="isSpicy"
                    checked={formData.isSpicy}
                    onChange={handleInputChange}
                  />
                  <span>Spicy</span>
                </label>
                <label className="modal-checkbox">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleInputChange}
                  />
                  <span>Popular Item</span>
                </label>
                <label className="modal-checkbox">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                  />
                  <span>In Stock</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? (
                    <><div className="spinner spinner-sm" /> Saving...</>
                  ) : (
                    editingPizza ? 'Update Pizza' : 'Create Pizza'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal card delete-confirm-modal">
            <div className="delete-modal-icon">
              <AlertTriangle size={36} />
            </div>
            <h3>Delete "{deleteTarget.name}"?</h3>
            <p>
              Are you sure you want to remove this pizza from the menu? This action cannot be undone.
            </p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button onClick={() => setDeleteTarget(null)} className="btn btn-outline">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-primary" style={{ background: '#dc2626' }}>
                Delete Pizza
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPizzas;

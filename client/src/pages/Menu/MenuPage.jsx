import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { pizzaAPI } from '../../services/api';
import PizzaCard from '../../components/PizzaCard/PizzaCard';
import './MenuPage.css';

const CATEGORIES = ['All', 'Classic', 'Cheese Lovers', 'Vegetarian', 'Spicy', 'Premium'];
const SORTS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('rating');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchPizzas = useCallback(() => {
    setLoading(true);
    const params = { sort };
    if (debouncedSearch) params.search = debouncedSearch;
    if (category !== 'All') params.category = category;

    pizzaAPI.getAll(params)
      .then(({ data }) => setPizzas(data.data))
      .catch(() => setPizzas([]))
      .finally(() => setLoading(false));
  }, [debouncedSearch, category, sort]);

  useEffect(() => { fetchPizzas(); }, [fetchPizzas]);

  // Sync category from URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, []);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat !== 'All') setSearchParams({ category: cat });
    else setSearchParams({});
  };

  const clearSearch = () => setSearch('');

  return (
    <div className="menu-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Our Pizza Menu</h1>
          <p>Handcrafted with the finest ingredients — find your perfect pizza</p>
        </div>
      </section>

      <div className="container menu-container">
        {/* Filters */}
        <div className="menu-filters">
          {/* Search */}
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search pizzas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              aria-label="Search pizzas"
            />
            {search && (
              <button onClick={clearSearch} className="search-clear" aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="sort-box">
            <SlidersHorizontal size={16} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="sort-select"
              aria-label="Sort pizzas"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs" role="tablist">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={category === cat}
              className={`cat-tab ${category === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="results-count">
            {pizzas.length === 0
              ? 'No pizzas found'
              : `${pizzas.length} pizza${pizzas.length > 1 ? 's' : ''} found`}
            {category !== 'All' && ` in "${category}"`}
            {debouncedSearch && ` for "${debouncedSearch}"`}
          </p>
        )}

        {/* Pizza Grid */}
        {loading ? (
          <div className="loading-center" style={{ paddingBottom: 80 }}>
            <div className="spinner" />
          </div>
        ) : pizzas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍕</div>
            <h3>No Pizzas Found</h3>
            <p>Try adjusting your search or filter.</p>
            <button
              className="btn btn-outline"
              onClick={() => { setSearch(''); setCategory('All'); setSearchParams({}); }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="menu-pizza-grid">
            {pizzas.map((pizza) => (
              <PizzaCard key={pizza._id} pizza={pizza} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;

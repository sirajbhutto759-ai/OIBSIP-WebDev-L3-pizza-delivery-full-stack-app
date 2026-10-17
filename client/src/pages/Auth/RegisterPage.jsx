import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Pizza, User, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Please enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to PizzaHub, ${user.name.split(' ')[0]}! 🍕`);
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = (id, label, type, placeholder, icon) => (
    <div className="form-group">
      <label htmlFor={id} className="form-label">{label}</label>
      <div className="input-icon-wrap">
        <span className="input-icon">{icon}</span>
        <input
          id={id}
          type={type}
          name={id}
          value={form[id]}
          onChange={handleChange}
          className={`form-input input-with-icon ${errors[id] ? 'error' : ''}`}
          placeholder={placeholder}
          autoComplete={id}
        />
      </div>
      {errors[id] && <p className="form-error">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo"><Pizza size={28} />PizzaHub</div>
          <h2>Join PizzaHub!</h2>
          <p>Create your account and enjoy fast delivery, order tracking, and exclusive member deals.</p>
          <img
            src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80"
            alt="Hot pizza"
            className="auth-hero-img"
          />
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1>Create Account</h1>
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {field('name', 'Full Name', 'text', 'John Doe', <User size={17} />)}
            {field('email', 'Email Address', 'email', 'you@example.com', <Mail size={17} />)}
            {field('phone', 'Phone Number (optional)', 'tel', '+92 300 1234567', <Phone size={17} />)}

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={17} className="input-icon" />
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`form-input input-with-icon input-with-toggle ${errors.password ? 'error' : ''}`}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
                <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-icon-wrap">
                <Lock size={17} className="input-icon" />
                <input
                  id="confirmPassword"
                  type={showPwd ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`form-input input-with-icon ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="auth-terms">
            By registering, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

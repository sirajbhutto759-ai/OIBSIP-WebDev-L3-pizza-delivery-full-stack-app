import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Pizza } from 'lucide-react';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="notfound-page">
      <div className="container notfound-content">
        <div className="notfound-icon-wrap">
          <span className="notfound-emoji">🍕</span>
          <span className="notfound-code">404</span>
        </div>
        <h1>Oops! Looks Like That Slice Got Eaten!</h1>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary btn-lg">
            <Home size={18} /> Back to Home
          </Link>
          <Link to="/menu" className="btn btn-outline btn-lg">
            <Pizza size={18} /> Browse Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

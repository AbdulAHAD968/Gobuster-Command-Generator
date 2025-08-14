import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="animation-container">
          <div className="ghost">👻</div>
          <div className="spooky-text">Boo! Wrong turn!</div>
        </div>
        <Link to="/" className="home-link">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
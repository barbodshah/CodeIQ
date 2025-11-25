import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            CodeIQ
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>Your Learning Platform</p>
        </div>

        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <Link
            to="/main"
            style={{
              textDecoration: 'none',
              color: isActive('/main') ? '#667eea' : '#374151',
              fontWeight: isActive('/main') ? '600' : '500',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: isActive('/main') ? '#eef2ff' : 'transparent',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isActive('/main')) {
                e.target.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/main')) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            Main
          </Link>
          <Link
            to="/dashboard"
            style={{
              textDecoration: 'none',
              color: isActive('/dashboard') ? '#667eea' : '#374151',
              fontWeight: isActive('/dashboard') ? '600' : '500',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: isActive('/dashboard') ? '#eef2ff' : 'transparent',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isActive('/dashboard')) {
                e.target.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/dashboard')) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            Dashboard
          </Link>
          <Link
            to="/contact"
            style={{
              textDecoration: 'none',
              color: isActive('/contact') ? '#667eea' : '#374151',
              fontWeight: isActive('/contact') ? '600' : '500',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: isActive('/contact') ? '#eef2ff' : 'transparent',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isActive('/contact')) {
                e.target.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/contact')) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            Contact
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              color: '#374151',
              fontWeight: '500',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#374151';
            }}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}


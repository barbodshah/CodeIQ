import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/api";

const DEFAULT_LOGO = "/logo192.png"; // Default logo path
const BACKEND_URL = "http://localhost:8000"; // Backend URL

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO);

  useEffect(() => {
    const adminStatus = localStorage.getItem("is_admin");
    setIsAdmin(adminStatus === "true");
    
    // Fetch user info to get logo
    async function fetchUserInfo() {
      try {
        const response = await getCurrentUser();
        const user = response.data;
        if (user.logo_url) {
          // If logo URL starts with /uploads/, prepend backend URL
          const finalLogoUrl = user.logo_url.startsWith("/uploads/") 
            ? `${BACKEND_URL}${user.logo_url}`
            : user.logo_url;
          setLogoUrl(finalLogoUrl);
        } else {
          setLogoUrl(DEFAULT_LOGO);
        }
      } catch (err) {
        // If error, use default logo
        setLogoUrl(DEFAULT_LOGO);
      }
    }
    
    fetchUserInfo();
  }, [location.pathname]); // Refresh when route changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={logoUrl}
            alt="CodeIQ Logo"
            onError={(e) => {
              // Fallback to default if image fails to load
              e.target.src = DEFAULT_LOGO;
            }}
            style={{
              width: '2.5rem',
              height: '2.5rem',
              objectFit: 'contain',
              borderRadius: '0.5rem'
            }}
          />
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
          {isAdmin && (
            <Link
              to="/admin"
              style={{
                textDecoration: 'none',
                color: isActive('/admin') ? '#667eea' : '#374151',
                fontWeight: isActive('/admin') ? '600' : '500',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: isActive('/admin') ? '#eef2ff' : 'transparent',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (!isActive('/admin')) {
                  e.target.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/admin')) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin
            </Link>
          )}
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


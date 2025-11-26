import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, purchaseCourse } from "../services/api";
import Header from "../components/Header";

export default function Purchase() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await getCourseById(courseId);
        setCourse(response.data);
        
        // If already purchased, redirect to dashboard
        if (response.data.is_purchased) {
          navigate("/dashboard");
        }
      } catch (err) {
        setError(err.response?.data?.detail || err.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, navigate]);

  const handlePurchase = async () => {
    setPurchasing(true);
    setPurchaseError(null);
    
    try {
      await purchaseCourse(courseId);
      setPurchaseSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setPurchaseError(err.response?.data?.detail || err.message || "Failed to purchase course");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            width: '3rem',
            height: '3rem',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }}></div>
          <p style={{ color: '#4b5563', fontSize: '1.125rem', fontWeight: '500' }}>Loading course...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          maxWidth: '28rem',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            marginBottom: '1rem'
          }}>
            <svg style={{ width: '2rem', height: '2rem', color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Error</h1>
          <p style={{ color: '#dc2626', marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#667eea',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />

      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '3rem 1.5rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '3rem',
          textAlign: 'center'
        }}>
          {purchaseSuccess ? (
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '5rem',
                height: '5rem',
                borderRadius: '50%',
                backgroundColor: '#d1fae5',
                marginBottom: '1.5rem'
              }}>
                <svg style={{ width: '3rem', height: '3rem', color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Purchase Successful!
              </h2>
              <p style={{ color: '#4b5563', fontSize: '1.125rem', marginBottom: '2rem' }}>
                You now have access to "{course.title}". Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '5rem',
                height: '5rem',
                borderRadius: '50%',
                background: 'linear-gradient(to right, #667eea, #764ba2)',
                marginBottom: '1.5rem'
              }}>
                <svg style={{ width: '3rem', height: '3rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Purchase Course
              </h2>
              
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '0.75rem',
                padding: '2rem',
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.75rem'
                }}>
                  {course.title}
                </h3>
                <p style={{
                  color: '#4b5563',
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  {course.description}
                </p>
              </div>

              {purchaseError && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  textAlign: 'left'
                }}>
                  <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>
                    {purchaseError}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={() => navigate("/dashboard")}
                  disabled={purchasing}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: purchasing ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    opacity: purchasing ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!purchasing) {
                      e.target.style.backgroundColor = '#d1d5db';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!purchasing) {
                      e.target.style.backgroundColor = '#e5e7eb';
                    }
                  }}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  style={{
                    padding: '0.75rem 2rem',
                    background: purchasing 
                      ? '#9ca3af' 
                      : 'linear-gradient(to right, #667eea, #764ba2)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: purchasing ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: purchasing 
                      ? 'none' 
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  onMouseEnter={(e) => {
                    if (!purchasing) {
                      e.target.style.opacity = '0.9';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!purchasing) {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {purchasing ? (
                    <>
                      <div style={{
                        width: '1rem',
                        height: '1rem',
                        border: '2px solid white',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Processing...
                    </>
                  ) : (
                    'Purchase Course'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}


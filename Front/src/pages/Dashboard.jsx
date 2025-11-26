import { useEffect, useState } from "react";
import { getAllCourses, getCourseSessions } from "../services/api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessionsError, setSessionsError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await getAllCourses();
        setCourses(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || "بارگذاری دوره‌ها با خطا مواجه شد");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const handleCourseClick = async (courseId) => {
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
      setSessions([]);
      return;
    }

    setSelectedCourseId(courseId);
    setLoadingSessions(true);
    setSessionsError(null);
    
    try {
      const response = await getCourseSessions(courseId);
      setSessions(response.data || []);
    } catch (err) {
      setSessionsError(err.response?.data?.detail || err.message || "بارگذاری جلسات با خطا مواجه شد");
      setSessions([]);
    } finally {
      setLoadingSessions(false);
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
          <p style={{ color: '#4b5563', fontSize: '1.125rem', fontWeight: '500' }}>در حال بارگذاری دوره‌ها...</p>
        </div>
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
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '2rem',
          maxWidth: '28rem',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center' }}>
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>خطا</h1>
            <p style={{ color: '#dc2626', marginBottom: '1.5rem' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1.5rem',
                padding: '0.5rem 1.5rem',
                backgroundColor: '#667eea',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getGridColumns = () => {
    if (courses.length === 1) return '1fr';
    if (courses.length === 2) return 'repeat(2, 1fr)';
    return 'repeat(auto-fit, minmax(300px, 1fr))';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />

      {/* Main Content */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem',
            margin: '0 0 0.5rem 0'
          }}>
            دوره‌های موجود
          </h2>
          <p style={{ color: '#4b5563', margin: 0 }}>دوره‌ها را بررسی کنید و برای مشاهده جلسات، یکی را انتخاب کنید</p>
        </div>

        {courses.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '5rem',
              height: '5rem',
              borderRadius: '50%',
              backgroundColor: '#f3f4f6',
              marginBottom: '1rem'
            }}>
              <svg style={{ width: '2.5rem', height: '2.5rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>دوره‌ای موجود نیست</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>بعداً برای دوره‌های جدید بررسی کنید</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: getGridColumns(),
            gap: '1.5rem'
          }}>
            {courses.map((course) => {
              const isSelected = selectedCourseId === course._id;
              return (
                <div
                  key={course._id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    boxShadow: isSelected 
                      ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
                      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    border: isSelected ? '2px solid #667eea' : '2px solid transparent',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <div
                    onClick={() => handleCourseClick(course._id)}
                    style={{
                      padding: '1.5rem',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#eef2ff' : 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          color: '#1f2937',
                          marginBottom: '0.5rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {course.title}
                        </h3>
                        <p style={{
                          color: '#4b5563',
                          fontSize: '0.875rem',
                          lineHeight: '1.5',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {course.description}
                        </p>
                      </div>
                      <div style={{
                        marginRight: '1rem',
                        transition: 'transform 0.3s',
                        transform: isSelected ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}>
                        <svg style={{ width: '1.25rem', height: '1.25rem', color: '#667eea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div style={{
                      borderTop: '1px solid #e5e7eb',
                      backgroundColor: '#f9fafb'
                    }}>
                      <div style={{ padding: '1.5rem' }}>
                        {course.is_purchased ? (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                              <div style={{
                                height: '4px',
                                width: '3rem',
                                backgroundColor: '#667eea',
                                borderRadius: '9999px',
                                marginRight: '0.75rem'
                              }}></div>
                              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>جلسات</h4>
                            </div>
                            
                            {loadingSessions ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
                                <div style={{
                                  width: '1.5rem',
                                  height: '1.5rem',
                                  border: '2px solid #e5e7eb',
                                  borderTop: '2px solid #667eea',
                                  borderRadius: '50%',
                                  animation: 'spin 1s linear infinite',
                                  marginRight: '0.75rem'
                                }}></div>
                                <p style={{ color: '#6b7280', margin: 0 }}>در حال بارگذاری جلسات...</p>
                              </div>
                            ) : sessionsError ? (
                              <div style={{
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '0.5rem',
                                padding: '1rem'
                              }}>
                                <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>{sessionsError}</p>
                              </div>
                            ) : sessions.length === 0 ? (
                              <div style={{
                                backgroundColor: '#f9fafb',
                                borderRadius: '0.5rem',
                                padding: '1rem',
                                textAlign: 'center'
                              }}>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>برای این دوره جلسه‌ای موجود نیست</p>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {sessions.map((session, index) => (
                                  <div
                                    key={session._id}
                                    onClick={() => navigate(`/session/${session._id}`)}
                                    style={{
                                      backgroundColor: 'white',
                                      border: '1px solid #e5e7eb',
                                      borderRadius: '0.75rem',
                                      padding: '1rem',
                                      transition: 'all 0.2s',
                                      cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.borderColor = '#a5b4fc';
                                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                                      e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.borderColor = '#e5e7eb';
                                      e.currentTarget.style.boxShadow = 'none';
                                      e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                      <div style={{
                                        flexShrink: 0,
                                        width: '2rem',
                                        height: '2rem',
                                        borderRadius: '0.5rem',
                                        background: 'linear-gradient(to bottom right, #667eea, #764ba2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        fontWeight: 'bold',
                                        marginRight: '0.75rem'
                                      }}>
                                        {index + 1}
                                      </div>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <h5 style={{
                                          fontWeight: '600',
                                          color: '#1f2937',
                                          marginBottom: '0.25rem',
                                          margin: '0 0 0.25rem 0'
                                        }}>
                                          {session.title}
                                        </h5>
                                        {session.description && (
                                          <p style={{
                                            fontSize: '0.875rem',
                                            color: '#4b5563',
                                            marginBottom: '0.5rem',
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            margin: '0 0 0.5rem 0'
                                          }}>
                                            {session.description}
                                          </p>
                                        )}
                                        {session.sections && session.sections.length > 0 && (
                                          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: '#6b7280' }}>
                                            <svg style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <span>{session.sections.length} بخش</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div style={{
                            backgroundColor: '#fef3c7',
                            border: '1px solid #fcd34d',
                            borderRadius: '0.75rem',
                            padding: '1.5rem',
                            textAlign: 'center'
                          }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '3rem',
                              height: '3rem',
                              borderRadius: '50%',
                              backgroundColor: '#fbbf24',
                              marginBottom: '1rem'
                            }}>
                              <svg style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h4 style={{
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: '#92400e',
                              marginBottom: '0.5rem'
                            }}>
                              دوره خریداری نشده
                            </h4>
                            <p style={{
                              color: '#78350f',
                              fontSize: '0.875rem',
                              marginBottom: '1.5rem'
                            }}>
                              برای دسترسی به جلسات این دوره، باید آن را خریداری کنید.
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/purchase/${course._id}`);
                              }}
                              style={{
                                padding: '0.75rem 2rem',
                                background: 'linear-gradient(to right, #667eea, #764ba2)',
                                color: 'white',
                                borderRadius: '0.5rem',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '1rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.opacity = '0.9';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.opacity = '1';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                              }}
                            >
                              خرید دوره
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

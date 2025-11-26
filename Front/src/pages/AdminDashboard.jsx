import { useEffect, useState } from "react";
import { getAllUsers, getAllCoursesAdmin, uploadUserLogo } from "../services/api";
import Header from "../components/Header";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users"); // "users" or "courses"
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [coursesError, setCoursesError] = useState(null);
  const [editingLogo, setEditingLogo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [updatingLogo, setUpdatingLogo] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        await Promise.all([fetchUsers(), fetchCourses()]);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleEditLogo = (user) => {
    setEditingLogo(user._id);
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleCancelEdit = () => {
    setEditingLogo(null);
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        e.target.value = "";
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        e.target.value = "";
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateLogo = async (userId) => {
    if (!selectedFile) {
      alert("Please select an image file");
      return;
    }

    setUpdatingLogo(true);
    try {
      const response = await uploadUserLogo(userId, selectedFile);
      // Show success message
      alert("Logo uploaded successfully!");
      // Refresh users list
      await fetchUsers();
      setEditingLogo(null);
      setSelectedFile(null);
      setFilePreview(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.detail || err.message || "Failed to upload logo");
    } finally {
      setUpdatingLogo(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError(null);
    try {
      const response = await getAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      setUsersError(err.response?.data?.detail || err.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchCourses = async () => {
    setLoadingCourses(true);
    setCoursesError(null);
    try {
      const response = await getAllCoursesAdmin();
      setCourses(response.data || []);
    } catch (err) {
      setCoursesError(err.response?.data?.detail || err.message || "Failed to load courses");
      setCourses([]);
    } finally {
      setLoadingCourses(false);
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
          <p style={{ color: '#4b5563', fontSize: '1.125rem', fontWeight: '500' }}>Loading...</p>
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
            onClick={() => window.location.reload()}
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
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />

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
            Admin Dashboard
          </h2>
          <p style={{ color: '#4b5563', margin: 0 }}>Manage users and courses</p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <button
            onClick={() => setActiveTab("users")}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === "users" ? '#667eea' : 'transparent',
              color: activeTab === "users" ? 'white' : '#4b5563',
              border: 'none',
              borderBottom: activeTab === "users" ? '3px solid #667eea' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === "users" ? '600' : '500',
              fontSize: '1rem',
              transition: 'all 0.2s',
              marginBottom: '-2px'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "users") {
                e.target.style.color = '#667eea';
                e.target.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "users") {
                e.target.style.color = '#4b5563';
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === "courses" ? '#667eea' : 'transparent',
              color: activeTab === "courses" ? 'white' : '#4b5563',
              border: 'none',
              borderBottom: activeTab === "courses" ? '3px solid #667eea' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === "courses" ? '600' : '500',
              fontSize: '1rem',
              transition: 'all 0.2s',
              marginBottom: '-2px'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "courses") {
                e.target.style.color = '#667eea';
                e.target.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "courses") {
                e.target.style.color = '#4b5563';
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            Courses ({courses.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  All Users
                </h3>
                <button
                  onClick={fetchUsers}
                  disabled={loadingUsers}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: loadingUsers ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    opacity: loadingUsers ? 0.6 : 1
                  }}
                >
                  {loadingUsers ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {loadingUsers ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    border: '3px solid #e5e7eb',
                    borderTop: '3px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '1rem'
                  }}></div>
                  <p style={{ color: '#6b7280', margin: 0 }}>Loading users...</p>
                </div>
              ) : usersError ? (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>{usersError}</p>
                </div>
              ) : users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <p style={{ color: '#6b7280', fontSize: '1rem' }}>No users found</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {users.map((user) => (
                    <div
                      key={user._id}
                      style={{
                        padding: '1.5rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        backgroundColor: user.is_admin ? '#fef3c7' : '#f9fafb'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <h4 style={{
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: '#1f2937',
                              margin: 0
                            }}>
                              {user.username}
                            </h4>
                            {user.is_admin && (
                              <span style={{
                                padding: '0.25rem 0.75rem',
                                backgroundColor: '#fbbf24',
                                color: '#78350f',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                              }}>
                                Admin
                              </span>
                            )}
                          </div>
                          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
                            {user.email}
                          </p>
                          {user.purchased_courses && user.purchased_courses.length > 0 && (
                            <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: '0 0 0.75rem 0' }}>
                              Purchased {user.purchased_courses.length} course{user.purchased_courses.length !== 1 ? 's' : ''}
                            </p>
                          )}
                          
                          {user.logo_url && !editingLogo && (
                            <div style={{
                              marginTop: '0.75rem',
                              marginBottom: '0.75rem',
                              padding: '0.75rem',
                              backgroundColor: 'white',
                              borderRadius: '0.5rem',
                              border: '1px solid #e5e7eb',
                              display: 'inline-block'
                            }}>
                              <p style={{
                                fontSize: '0.75rem',
                                color: '#6b7280',
                                marginBottom: '0.5rem',
                                margin: '0 0 0.5rem 0'
                              }}>
                                Current Logo:
                              </p>
                              <img
                                src={user.logo_url.startsWith("/uploads/") 
                                  ? `http://localhost:8000${user.logo_url}`
                                  : user.logo_url}
                                alt="User logo"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                                style={{
                                  maxWidth: '100px',
                                  maxHeight: '100px',
                                  objectFit: 'contain',
                                  borderRadius: '0.375rem'
                                }}
                              />
                            </div>
                          )}
                          
                          {editingLogo === user._id ? (
                            <div style={{
                              marginTop: '0.75rem',
                              padding: '1rem',
                              backgroundColor: '#f9fafb',
                              borderRadius: '0.5rem',
                              border: '1px solid #e5e7eb'
                            }}>
                              <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '0.5rem'
                              }}>
                                Select Image File:
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem',
                                  marginBottom: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              />
                              {filePreview && (
                                <div style={{
                                  marginBottom: '0.75rem',
                                  padding: '0.75rem',
                                  backgroundColor: 'white',
                                  borderRadius: '0.375rem',
                                  border: '1px solid #e5e7eb',
                                  textAlign: 'center'
                                }}>
                                  <p style={{
                                    fontSize: '0.75rem',
                                    color: '#6b7280',
                                    marginBottom: '0.5rem',
                                    margin: '0 0 0.5rem 0'
                                  }}>
                                    Preview:
                                  </p>
                                  <img
                                    src={filePreview}
                                    alt="Logo preview"
                                    style={{
                                      maxWidth: '100%',
                                      maxHeight: '150px',
                                      objectFit: 'contain',
                                      borderRadius: '0.375rem'
                                    }}
                                  />
                                </div>
                              )}
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  onClick={() => handleUpdateLogo(user._id)}
                                  disabled={updatingLogo || !selectedFile}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: updatingLogo || !selectedFile ? '#9ca3af' : '#667eea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    cursor: updatingLogo || !selectedFile ? 'not-allowed' : 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    opacity: updatingLogo || !selectedFile ? 0.6 : 1
                                  }}
                                >
                                  {updatingLogo ? 'Uploading...' : 'Upload Logo'}
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  disabled={updatingLogo}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#e5e7eb',
                                    color: '#374151',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    cursor: updatingLogo ? 'not-allowed' : 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '500'
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditLogo(user)}
                              style={{
                                marginTop: '0.75rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#f3f4f6',
                                color: '#374151',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#e5e7eb';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#f3f4f6';
                              }}
                            >
                              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {user.logo_url ? 'Change Logo' : 'Set Logo'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  All Courses
                </h3>
                <button
                  onClick={fetchCourses}
                  disabled={loadingCourses}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: loadingCourses ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    opacity: loadingCourses ? 0.6 : 1
                  }}
                >
                  {loadingCourses ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {loadingCourses ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    border: '3px solid #e5e7eb',
                    borderTop: '3px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '1rem'
                  }}></div>
                  <p style={{ color: '#6b7280', margin: 0 }}>Loading courses...</p>
                </div>
              ) : coursesError ? (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>{coursesError}</p>
                </div>
              ) : courses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <p style={{ color: '#6b7280', fontSize: '1rem' }}>No courses found</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {courses.map((course) => (
                    <div
                      key={course._id}
                      style={{
                        padding: '1.5rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        backgroundColor: '#f9fafb'
                      }}
                    >
                      <h4 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '0.5rem',
                        margin: '0 0 0.5rem 0'
                      }}>
                        {course.title}
                      </h4>
                      <p style={{
                        color: '#4b5563',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        marginBottom: '0.75rem',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        margin: '0 0 0.75rem 0'
                      }}>
                        {course.description}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        {course.sessions && course.sessions.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>{course.sessions.length} session{course.sessions.length !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                        {course.session_ids && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>Author ID: {course.author_id}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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


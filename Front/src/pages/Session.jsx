import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSessionById } from "../services/api";

export default function Session() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [codeInputs, setCodeInputs] = useState({});

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await getSessionById(sessionId);
        setSession(response.data);
        // Initialize code inputs for each section
        const initialCodes = {};
        response.data.sections?.forEach((section, index) => {
          initialCodes[index] = "";
        });
        setCodeInputs(initialCodes);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    }

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  const handleCodeChange = (sectionIndex, value) => {
    setCodeInputs({
      ...codeInputs,
      [sectionIndex]: value
    });
  };

  const handleSubmit = (sectionIndex, questionId) => {
    // Placeholder for submit functionality
    console.log("Submitting code for question:", questionId);
    console.log("Code:", codeInputs[sectionIndex]);
    alert("Submit functionality will be implemented soon!");
  };

  const extractAparatVideoId = (url) => {
    if (!url) return null;
    // Aparat URLs can be in formats like:
    // https://www.aparat.com/v/{videoHash}
    // https://aparat.com/v/{videoHash}
    const match = url.match(/(?:aparat\.com\/v\/|aparat\.com\/video\/video\/embed\/videohash\/)([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const getAparatEmbedUrl = (videoUrl) => {
    const videoId = extractAparatVideoId(videoUrl);
    if (!videoId) return null;
    return `https://www.aparat.com/video/video/embed/videohash/${videoId}/vt/frame`;
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
          <p style={{ color: '#4b5563', fontSize: '1.125rem', fontWeight: '500' }}>Loading session...</p>
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

  if (!session) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                color: '#4b5563'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.color = '#111827';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#4b5563';
              }}
            >
              <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        {/* Session Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem',
            margin: '0 0 0.5rem 0'
          }}>
            {session.title}
          </h2>
          {session.description && (
            <p style={{ color: '#4b5563', fontSize: '1.125rem', margin: 0 }}>
              {session.description}
            </p>
          )}
        </div>

        {/* Sections */}
        {session.sections && session.sections.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {session.sections.map((section, index) => {
              const embedUrl = getAparatEmbedUrl(section.video_url);
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '2rem' }}>
                    {/* Section Title */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        margin: 0
                      }}>
                        {section.title}
                      </h3>
                    </div>

                    {/* Video */}
                    {embedUrl ? (
                      <div style={{
                        marginBottom: '1.5rem',
                        position: 'relative',
                        paddingBottom: '56.25%',
                        height: 0,
                        overflow: 'hidden',
                        borderRadius: '0.5rem',
                        backgroundColor: '#000'
                      }}>
                        <iframe
                          src={embedUrl}
                          allowFullScreen
                          webkitallowfullscreen="true"
                          mozallowfullscreen="true"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none'
                          }}
                        ></iframe>
                      </div>
                    ) : (
                      <div style={{
                        marginBottom: '1.5rem',
                        padding: '3rem',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '0.5rem',
                        textAlign: 'center',
                        color: '#6b7280'
                      }}>
                        Video URL not available or invalid
                      </div>
                    )}

                    {/* Section Description */}
                    {section.description && (
                      <div style={{
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem',
                        borderLeft: '4px solid #667eea'
                      }}>
                        <p style={{
                          color: '#374151',
                          lineHeight: '1.6',
                          margin: 0,
                          whiteSpace: 'pre-wrap'
                        }}>
                          {section.description}
                        </p>
                      </div>
                    )}

                    {/* Code Input */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Write your code here:
                      </label>
                      <textarea
                        value={codeInputs[index] || ""}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        placeholder="Enter your code..."
                        style={{
                          width: '100%',
                          minHeight: '200px',
                          padding: '1rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          lineHeight: '1.5',
                          resize: 'vertical',
                          outline: 'none',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={() => handleSubmit(index, section.question_id)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(to right, #667eea, #764ba2)',
                        color: 'white',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
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
                      Submit Code
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>No sections available for this session</p>
          </div>
        )}
      </main>
    </div>
  );
}


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSessionById, getQuestionById, submitCode } from "../services/api";

export default function Session() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [codeInputs, setCodeInputs] = useState({});
  const [questions, setQuestions] = useState({});
  const [loadingQuestions, setLoadingQuestions] = useState({});
  const [submitResults, setSubmitResults] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [submitErrors, setSubmitErrors] = useState({});

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
        
        // Fetch questions for each section
        if (response.data.sections) {
          response.data.sections.forEach((section, index) => {
            if (section.question_id) {
              fetchQuestion(section.question_id, index);
            }
          });
        }
      } catch (err) {
        setError(err.response?.data?.detail || err.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    }

    async function fetchQuestion(questionId, sectionIndex) {
      setLoadingQuestions(prev => ({ ...prev, [sectionIndex]: true }));
      try {
        const response = await getQuestionById(questionId);
        setQuestions(prev => ({
          ...prev,
          [sectionIndex]: response.data
        }));
      } catch (err) {
        console.error(`Failed to load question for section ${sectionIndex}:`, err);
        // Don't show error to user, just log it
      } finally {
        setLoadingQuestions(prev => ({ ...prev, [sectionIndex]: false }));
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

  const handleSubmit = async (sectionIndex, questionId) => {
    const code = codeInputs[sectionIndex] || "";
    
    if (!code.trim()) {
      alert("Please write some code before submitting!");
      return;
    }

    if (!questionId) {
      alert("Question ID is missing!");
      return;
    }

    setSubmitting(prev => ({ ...prev, [sectionIndex]: true }));
    setSubmitErrors(prev => ({ ...prev, [sectionIndex]: null }));
    setSubmitResults(prev => ({ ...prev, [sectionIndex]: null }));

    try {
      // Language ID 71 is Python by default
      const response = await submitCode(questionId, code, 71);
      setSubmitResults(prev => ({
        ...prev,
        [sectionIndex]: response.data
      }));
    } catch (err) {
      setSubmitErrors(prev => ({
        ...prev,
        [sectionIndex]: err.response?.data?.detail || err.message || "Failed to submit code"
      }));
    } finally {
      setSubmitting(prev => ({ ...prev, [sectionIndex]: false }));
    }
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

                    {/* Question Description */}
                    {section.question_id && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '0.75rem'
                        }}>
                          Question:
                        </h4>
                        {loadingQuestions[index] ? (
                          <div style={{
                            padding: '1rem',
                            backgroundColor: '#f9fafb',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <div style={{
                              width: '1rem',
                              height: '1rem',
                              border: '2px solid #e5e7eb',
                              borderTop: '2px solid #667eea',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading question...</span>
                          </div>
                        ) : questions[index] ? (
                          <div style={{
                            padding: '1rem',
                            backgroundColor: '#f0f9ff',
                            borderRadius: '0.5rem',
                            borderLeft: '4px solid #3b82f6',
                            marginBottom: '0.5rem'
                          }}>
                            <p style={{
                              color: '#1e40af',
                              fontWeight: '600',
                              fontSize: '0.875rem',
                              margin: '0 0 0.5rem 0'
                            }}>
                              {questions[index].title}
                            </p>
                            <p style={{
                              color: '#374151',
                              lineHeight: '1.6',
                              margin: 0,
                              whiteSpace: 'pre-wrap'
                            }}>
                              {questions[index].description}
                            </p>
                            {questions[index].constraints && (
                              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #bfdbfe' }}>
                                <p style={{
                                  color: '#1e40af',
                                  fontWeight: '600',
                                  fontSize: '0.875rem',
                                  margin: '0 0 0.25rem 0'
                                }}>
                                  Constraints:
                                </p>
                                <p style={{
                                  color: '#4b5563',
                                  fontSize: '0.875rem',
                                  margin: 0,
                                  whiteSpace: 'pre-wrap'
                                }}>
                                  {questions[index].constraints}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{
                            padding: '1rem',
                            backgroundColor: '#fef2f2',
                            borderRadius: '0.5rem',
                            borderLeft: '4px solid #ef4444'
                          }}>
                            <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>
                              Question not found
                            </p>
                          </div>
                        )}
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
                      disabled={submitting[index] || !section.question_id}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1.5rem',
                        background: submitting[index] || !section.question_id 
                          ? '#9ca3af' 
                          : 'linear-gradient(to right, #667eea, #764ba2)',
                        color: 'white',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: submitting[index] || !section.question_id ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: 'all 0.2s',
                        boxShadow: submitting[index] || !section.question_id 
                          ? 'none' 
                          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        opacity: submitting[index] || !section.question_id ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        if (!submitting[index] && section.question_id) {
                          e.target.style.opacity = '0.9';
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!submitting[index] && section.question_id) {
                          e.target.style.opacity = '1';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                        }
                      }}
                    >
                      {submitting[index] ? (
                        <>
                          <div style={{
                            width: '1.25rem',
                            height: '1.25rem',
                            border: '2px solid white',
                            borderTop: '2px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                          Judging...
                        </>
                      ) : (
                        'Submit Code'
                      )}
                    </button>

                    {/* Submit Error */}
                    {submitErrors[index] && (
                      <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <svg style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626', flexShrink: 0, marginTop: '0.125rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>
                            {submitErrors[index]}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Submit Results */}
                    {submitResults[index] && (() => {
                      const results = submitResults[index].results || [];
                      const passedCount = results.filter(r => r.status?.id === 3).length;
                      const totalCount = results.length;
                      const isAccepted = submitResults[index].verdict === 'Accepted';
                      
                      return (
                        <div style={{
                          marginTop: '1rem',
                          padding: '1.5rem',
                          backgroundColor: isAccepted 
                            ? '#f0fdf4' 
                            : '#fef2f2',
                          border: `2px solid ${isAccepted ? '#10b981' : '#ef4444'}`,
                          borderRadius: '0.5rem'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                          }}>
                            <div style={{
                              width: '3rem',
                              height: '3rem',
                              borderRadius: '50%',
                              backgroundColor: isAccepted ? '#10b981' : '#ef4444',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {isAccepted ? (
                                <svg style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: isAccepted ? '#065f46' : '#991b1b',
                                margin: '0 0 0.5rem 0'
                              }}>
                                {isAccepted ? '✓ Accepted' : '✗ Failed'}
                              </h4>
                              <p style={{
                                fontSize: '1rem',
                                color: isAccepted ? '#047857' : '#b91c1c',
                                margin: 0,
                                fontWeight: '500'
                              }}>
                                {passedCount} out of {totalCount} test cases passed
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
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


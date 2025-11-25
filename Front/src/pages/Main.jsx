import Header from "../components/Header";

export default function Main() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />
      
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '3rem 1.5rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '3rem',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Welcome to CodeIQ
          </h1>
          
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.8',
            color: '#374151',
            fontSize: '1.125rem'
          }}>
            <p style={{ marginBottom: '1.5rem' }}>
              CodeIQ is a comprehensive learning platform designed to help you master programming and problem-solving skills. 
              Whether you're a beginner or an experienced developer, our platform offers structured courses and interactive 
              coding sessions to enhance your abilities.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              Our platform provides a unique learning experience where you can:
            </p>
            
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '1.5rem'
            }}>
              <li style={{
                marginBottom: '1rem',
                paddingLeft: '2rem',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: '0.5rem',
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(to right, #667eea, #764ba2)'
                }}></span>
                <strong style={{ color: '#1f2937' }}>Interactive Coding Sessions:</strong> Practice coding in real-time with 
                hands-on exercises and challenges that adapt to your skill level.
              </li>
              
              <li style={{
                marginBottom: '1rem',
                paddingLeft: '2rem',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: '0.5rem',
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(to right, #667eea, #764ba2)'
                }}></span>
                <strong style={{ color: '#1f2937' }}>Structured Courses:</strong> Follow carefully designed learning paths 
                that guide you from fundamentals to advanced topics.
              </li>
              
              <li style={{
                marginBottom: '1rem',
                paddingLeft: '2rem',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: '0.5rem',
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(to right, #667eea, #764ba2)'
                }}></span>
                <strong style={{ color: '#1f2937' }}>Progress Tracking:</strong> Monitor your learning journey and see your 
                improvement over time with detailed analytics and progress reports.
              </li>
              
              <li style={{
                marginBottom: '1rem',
                paddingLeft: '2rem',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: '0.5rem',
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(to right, #667eea, #764ba2)'
                }}></span>
                <strong style={{ color: '#1f2937' }}>Expert Guidance:</strong> Learn from industry professionals and get 
                feedback on your code to improve your programming skills.
              </li>
            </ul>
            
            <p style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#eef2ff',
              borderRadius: '0.75rem',
              borderLeft: '4px solid #667eea',
              color: '#1e40af',
              fontWeight: '500'
            }}>
              Ready to start your coding journey? Visit the Dashboard to explore available courses and begin your first session!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}


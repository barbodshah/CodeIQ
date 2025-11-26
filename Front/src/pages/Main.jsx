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
            به CodeIQ خوش آمدید
          </h1>
          
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.8',
            color: '#374151',
            fontSize: '1.125rem'
          }}>
            <p style={{ marginBottom: '1.5rem' }}>
              CodeIQ یک پلتفرم یادگیری جامع است که برای کمک به تسلط شما بر مهارت‌های برنامه‌نویسی و حل مسئله طراحی شده است. 
              چه مبتدی باشید و چه یک توسعه‌دهنده با تجربه، پلتفرم ما دوره‌های ساختاریافته و جلسات کدنویسی تعاملی را برای 
              بهبود توانایی‌های شما ارائه می‌دهد.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              پلتفرم ما یک تجربه یادگیری منحصر به فرد ارائه می‌دهد که می‌توانید:
            </p>
            
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '1.5rem'
            }}>
              <li style={{
                marginBottom: '1rem',
                paddingRight: '2rem',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  right: 0,
                  top: '0.5rem',
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(to right, #667eea, #764ba2)'
                }}></span>
                <strong style={{ color: '#1f2937' }}>جلسات کدنویسی تعاملی:</strong> با تمرین‌ها و چالش‌های عملی که با سطح مهارت شما سازگار است، 
                به صورت بلادرنگ کدنویسی تمرین کنید.
              </li>
              
              <li style={{
                marginBottom: '1rem',
                paddingRight: '2rem',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  right: 0,
                  top: '0.5rem',
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(to right, #667eea, #764ba2)'
                }}></span>
                <strong style={{ color: '#1f2937' }}>دوره‌های ساختاریافته:</strong> مسیرهای یادگیری با دقت طراحی شده را دنبال کنید 
                که شما را از مبانی تا موضوعات پیشرفته راهنمایی می‌کند.
              </li>
              
              <li style={{
                marginBottom: '1rem',
                paddingRight: '2rem',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  right: 0,
                  top: '0.5rem',
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(to right, #667eea, #764ba2)'
                }}></span>
                <strong style={{ color: '#1f2937' }}>ردیابی پیشرفت:</strong> سفر یادگیری خود را نظارت کنید و پیشرفت خود را 
                در طول زمان با تجزیه و تحلیل‌های دقیق و گزارش‌های پیشرفت مشاهده کنید.
              </li>
              
              <li style={{
                marginBottom: '1rem',
                paddingRight: '2rem',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  right: 0,
                  top: '0.5rem',
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(to right, #667eea, #764ba2)'
                }}></span>
                <strong style={{ color: '#1f2937' }}>راهنمایی متخصص:</strong> از متخصصان صنعت بیاموزید و 
                بازخورد کد خود را دریافت کنید تا مهارت‌های برنامه‌نویسی خود را بهبود بخشید.
              </li>
            </ul>
            
            <p style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#eef2ff',
              borderRadius: '0.75rem',
              borderRight: '4px solid #667eea',
              color: '#1e40af',
              fontWeight: '500'
            }}>
              آماده شروع سفر کدنویسی خود هستید؟ به داشبورد بروید تا دوره‌های موجود را بررسی کنید و اولین جلسه خود را شروع کنید!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}


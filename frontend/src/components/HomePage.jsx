import React from 'react';

export default function HomePage({ onGetStarted }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      padding: '20px',
      textAlign: 'center',
      boxSizing: 'border-box'
    }}>
      {/* Decorative Container Card */}
      <div style={{ 
        maxWidth: '650px', 
        padding: '40px', 
        borderRadius: '16px', 
        background: 'rgba(255, 255, 255, 0.03)', 
        backdropFilter: 'blur(12px)', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' 
      }}>
        
        {/* Floating Rocket Icon */}
        <div style={{ fontSize: '50px', marginBottom: '20px' }}>🚀</div>
        
        <h1 style={{ 
          fontSize: '38px', 
          fontWeight: '800', 
          marginBottom: '16px', 
          letterSpacing: '-0.5px', 
          background: 'linear-gradient(to right, #60a5fa, #34d399)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent' 
        }}>
          Bulk Offer Letter Dispatch Engine
        </h1>
        
        <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '32px' }}>
          Automate your candidate onboarding pipeline seamlessly. Upload candidate data sheets, customize document templates, select brand configurations, and dynamically generate downloadable PDFs sent straight to your recipients in bulk parallel batches.
        </p>

        {/* The Gateway Action Button */}
        <button
          onClick={onGetStarted}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '16px 40px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
          }}
          onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
          onMouseLeave={(e) => e.target.style.background = '#2563eb'}
        >
          Get Started ✨
        </button>

      </div>

      {/* Footer Branding Status */}
      <div style={{ marginTop: '40px', fontSize: '12px', color: '#64748b', letterSpacing: '0.5px' }}>
        POWERED BY BREVO TRANSACTIONAL WEB API • PRODUCTION ACTIVE
      </div>
    </div>
  );
}
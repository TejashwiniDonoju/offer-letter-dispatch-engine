import React, { useState } from 'react';
import HomePage from './components/HomePage'; // 🌟 Ensure you create this file next!
import Step1Login from './components/Step1Login';
import Step2Upload from './components/Step2Upload';
import Step3Review from './components/Step3Review';
import Step4Customize from './components/Step4Customize';
import Step5Preview from './components/Step5Preview';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false); // 🌟 NEW: Controls the main Landing Home Page toggle
  const [step, setStep] = useState(1);
  const [token, setToken] = useState('');
  const [headers, setHeaders] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [htmlContent, setHtmlContent] = useState("<h1>Offer Letter</h1><p>Dear {{name}},</p><p>We are pleased to offer employment for the role of {{role}} at a compensation scale calculation tracking parameter of {{salary}}.</p>");

  // Customization Configuration States
  const [selectedLogo, setSelectedLogo] = useState('xyzon');     
  const [themeColor, setThemeColor] = useState('#1e3a8a');       
  const [layoutStyle, setLayoutStyle] = useState('modern');       

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleUpdateCandidate = (rowIndex, columnKey, newValue) => {
    setCandidates(prevCandidates => {
      const updated = [...prevCandidates];
      updated[rowIndex] = { ...updated[rowIndex], [columnKey]: newValue };
      return updated;
    });
  };

  const handleAddCandidateRow = () => {
    setCandidates(prevCandidates => [
      ...prevCandidates,
      { name: '', email: '', role: '', salary: '' }
    ]);
  };

  // 🗺️ Stepper Navigation Controller with validation safety checks
  const handleStepJump = (targetStep) => {
    if (targetStep > 1 && !token) {
      alert("Please log in successfully to access this step.");
      return;
    }
    if (targetStep > 2 && candidates.length === 0) {
      alert("Please upload candidate data in Step 2 before proceeding.");
      return;
    }
    setStep(targetStep);
  };

  // ================= 🏠 CONDITIONALLY RENDER LANDING HOME PAGE =================
  if (!hasStarted) {
    return <HomePage onGetStarted={() => setHasStarted(true)} />;
  }

  // ================= 🖥️ MAIN ENGINE WORKSPACE (RENDERED ONCE STARTED) =================
  return (
    <div className="wizard-container" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Floating Back-To-Home Link Button for convenience */}
      <div style={{ textAlign: 'left', maxWidth: '1200px', margin: '0 auto 10px auto' }}>
        <button 
          onClick={() => setHasStarted(false)} 
          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          ⬅️ Back to Landing Screen
        </button>
      </div>

      <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Enterprise Offer Letter Dispatch System</h2>
      
      {/* ================= 🗺️ INTERACTIVE CLICKABLE STEPPER HEADERS ================= */}
      <div className="step-indicator-bar" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
        {[1, 2, 3, 4, 5].map(i => {
          const isAccessible = i === 1 || (token && (i === 2 || candidates.length > 0));

          return (
            <div 
              key={i} 
              onClick={() => handleStepJump(i)}
              className={`step-tab ${step === i ? 'active' : ''}`}
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                backgroundColor: step === i ? '#2563eb' : (isAccessible ? '#e2e8f0' : '#f1f5f9'),
                color: step === i ? 'white' : (isAccessible ? '#1e293b' : '#94a3b8'),
                fontWeight: 'bold',
                cursor: isAccessible ? 'pointer' : 'not-allowed',
                opacity: isAccessible ? 1 : 0.6,
                border: step === i ? '1px solid #2563eb' : '1px solid #cbd5e1',
                transition: 'all 0.15s ease-in-out'
              }}
              title={!isAccessible ? "Complete preceding setup parameters to unlock" : `Jump straight to Step ${i}`}
            >
              Step {i}
            </div>
          );
        })}
      </div>

      {/* ================= 🖥️ ACTIVE STEP PANEL ROUTER WORKSPACE ================= */}
      {step === 1 && (
        <Step1Login apiBase={API_BASE} onLoginSuccess={(t) => { setToken(t); setStep(2); }} />
      )}
      
      {step === 2 && (
        <Step2Upload apiBase={API_BASE} onUploadSuccess={(h, c) => { setHeaders(h); setCandidates(c); setStep(3); }} />
      )}
      
      {step === 3 && (
        <Step3Review 
          candidates={candidates}
          headers={headers}
          apiBase={API_BASE}
          htmlContent={htmlContent}
          onUpdateCandidate={handleUpdateCandidate} 
          onAddCandidate={handleAddCandidateRow} 
          onNextStep={() => setStep(4)} 
        />
      )}

      {step === 4 && (
        <Step4Customize 
          htmlContent={htmlContent} 
          setHtmlContent={setHtmlContent} 
          selectedLogo={selectedLogo}      
          setSelectedLogo={setSelectedLogo} 
          themeColor={themeColor}          
          setThemeColor={setThemeColor} 
          layoutStyle={layoutStyle}         
          setLayoutStyle={setLayoutStyle}
          onNext={() => setStep(5)} 
        />
      )}

      {step === 5 && (
        <Step5Preview 
          candidates={candidates} 
          htmlContent={htmlContent} 
          apiBase={API_BASE} 
          selectedLogo={selectedLogo}      
          themeColor={themeColor}          
          layoutStyle={layoutStyle}         
          onPrev={() => setStep(4)} 
        />
      )}
    </div>
  );
}
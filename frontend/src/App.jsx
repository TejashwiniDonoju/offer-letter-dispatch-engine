import React, { useState } from 'react';
import Step1Login from './components/Step1Login';
import Step2Upload from './components/Step2Upload';
import Step3Review from './components/Step3Review';
import Step4Customize from './components/Step4Customize';
import Step5Preview from './components/Step5Preview';

export default function App() {
  const [step, setStep] = useState(1);
  const [token, setToken] = useState('');
  const [headers, setHeaders] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [htmlContent, setHtmlContent] = useState("<h1>Offer Letter</h1><p>Dear {{name}},</p><p>We are pleased to offer employment for the role of {{role}} at a compensation scale calculation tracking parameter of {{salary}}.</p>");

  // 🌟 FIX: Declare the missing state variables so React doesn't throw a "ReferenceError"
  const [selectedLogo, setSelectedLogo] = useState('xyzon');     // Tracks selected logo image ('xyzon' | 'aicte')
  const [themeColor, setThemeColor] = useState('#1e3a8a');       // Tracks the primary banner branding color
  const [layoutStyle, setLayoutStyle] = useState('modern');       // Tracks the structure frame layout ('modern' | 'classic' | 'minimal')

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleUpdateCandidate = (rowIndex, columnKey, newValue) => {
    setCandidates(prevCandidates => {
      const updated = [...prevCandidates];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [columnKey]: newValue
      };
      return updated;
    });
  };
  const handleAddCandidateRow = () => {
  setCandidates(prevCandidates => [
    ...prevCandidates,
    { 
      name: '', 
      email: '', 
      role: '', 
      salary: '' 
      // This creates a fresh row. You can add more empty key-value fields here if needed!
    }
  ]);
};

  // 🗺️ Stepper Navigation Controller with validation safety checks
  const handleStepJump = (targetStep) => {
    // Check 1: Force authorization check before unlocking subsequent stages
    if (targetStep > 1 && !token) {
      alert("Please log in successfully to access this step.");
      return;
    }
    // Check 2: Prevent advancing to visual layouts if no csv/excel candidates are present
    if (targetStep > 2 && candidates.length === 0) {
      alert("Please upload candidate data in Step 2 before proceeding.");
      return;
    }
    setStep(targetStep);
  };

  return (
    <div className="wizard-container" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Enterprise Offer Letter Dispatch System</h2>
      
      {/* ================= 🗺️ INTERACTIVE CLICKABLE STEPPER HEADERS ================= */}
      <div className="step-indicator-bar" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
        {[1, 2, 3, 4, 5].map(i => {
          // Check if the step is accessible based on current data state
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
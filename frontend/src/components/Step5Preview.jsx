import React, { useState } from 'react';
import axios from 'axios';

export default function Step5Preview({ 
  candidates, 
  htmlContent, 
  apiBase, 
  emailSubject = "Your Internship Offer Letter Configuration",
  themeColor = "#1e3a8a", // Pulled down from Step 4 customization configurations
  layoutStyle = "modern", // 'modern' | 'classic' | 'minimal'
  selectedLogo = "xyzon"   // 'xyzon' | 'aicte'
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState('');
  const [previewMode, setPreviewMode] = useState('mail'); 

  const currentCandidate = candidates[activeIndex] || {};
  
  // This is the functional body text sent inside the email section itself
  const mailBodyMessage = `Hello ${currentCandidate.name || 'Candidate'},\n\nWe are pleased to inform you that your official internship selection process is complete. Your formal Internship Offer Letter has been successfully generated and attached to the bottom of this email as a PDF document for your review.\n\nPlease download, sign, and return the copy within the requested window.\n\nBest regards,\nOperations Team`;

  // Matches tag brackets into actual current target items
  const compileHtml = (template, data) => {
    if (!template) return '';
    let result = template;
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, data[key] || '');
    });
    return result;
  };

  // Compiles the core document typography strings
  const activeInnerHtml = compileHtml(htmlContent, currentCandidate);

  // 📐 Wraps the inner rich text body with the selected structure matching Step 4 configurations
  const buildFullDocumentLayout = (innerBodyHtml) => {
    const logoUrl = selectedLogo === 'xyzon' ? '/xyzon_logo.png' : '/aicte_logo.png';
    
    if (layoutStyle === 'classic') {
      return `
        <div style="background: #ffffff; max-width: 600px; margin: 20px auto; padding: 50px 40px; font-family: Georgia, serif; border: 3px double ${themeColor}; box-sizing: border-box;">
          <div style="text-align: center; margin-bottom: 35px;">
            <img src="${logoUrl}" alt="Logo" style="height: 55px; margin-bottom: 10px;" />
            <h1 style="margin: 5px 0 0 0; color: ${themeColor}; font-size: 22px; letter-spacing: 1px;">OFFICIAL APPOINTMENT</h1>
          </div>
          <hr style="border: 0; border-top: 1px solid ${themeColor}; margin-bottom: 30px;" />
          <div style="font-size: 15px; color: #111827; line-height: 1.8;">
            ${innerBodyHtml}
          </div>
        </div>`;
    }
    
    if (layoutStyle === 'minimal') {
      return `
        <div style="background: #ffffff; max-width: 550px; margin: 10px auto; padding: 24px; font-family: sans-serif; border-top: 4px solid ${themeColor}; box-sizing: border-box;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
            <img src="${logoUrl}" alt="Logo" style="height: 35px;" />
            <span style="font-size: 12px; color: #64748b; font-weight: 500;">Offer Confirmation</span>
          </div>
          <div style="color: #0f172a;">
            ${innerBodyHtml}
          </div>
        </div>`;
    }

    // Default 'modern' Layout Package Structure
    return `
      <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); max-width: 600px; margin: 20px auto; overflow: hidden; border: 1px solid #e2e8f0; box-sizing: border-box;">
        <div style="background: ${themeColor}; height: 10px; width: 100%;"></div>
        <div style="padding: 40px 32px;">
          <div style="margin-bottom: 30px; text-align: left;">
            <img src="${logoUrl}" alt="Logo" style="height: 45px; object-fit: contain;" />
          </div>
          <div style="border-left: 4px solid ${themeColor}; padding-left: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0; font-family: sans-serif; color: #1e293b; font-size: 20px;">INTERNSHIP OFFER LETTER</h2>
          </div>
          <div style="color: #334155;">
            ${innerBodyHtml}
          </div>
        </div>
      </div>`;
  };

  // The fully compiled HTML Document containing layout boundaries
  const activeFullTemplateHtml = buildFullDocumentLayout(activeInnerHtml);

  // SMTP Dispatcher handling body text parsing alongside template attachments
  const handleDispatch = async () => {
    if (!currentCandidate.email || !currentCandidate.name) {
      return alert('Incomplete parameter fields inside selected record slot.');
    }
    
    setStatus('Compiling PDF asset vectors and running SMTP delivery modules...');
    
    try {
      const backendUrl = apiBase || 'http://localhost:5000';
      const res = await axios.post(`${backendUrl}/api/dispatch`, {
        email: currentCandidate.email,
        name: currentCandidate.name,
        subject: emailSubject,
        messageBody: mailBodyMessage, // ✉️ The structural email copy description text
        htmlContent: activeFullTemplateHtml // 📄 The full layout schema to be turned into a PDF attachment at the bottom
      });
      setStatus(`Success: ${res.data.message}`);
    } catch (err) {
      const backendError = err.response?.data?.error;
      const backendDetails = err.response?.data?.details;
      setStatus(`❌ Dispatch Failure: ${backendError} | Info: ${backendDetails || err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* ================= LEFT CONTROLS & QUEUE SIDEBAR ================= */}
      <div style={{ flex: '1', minWidth: '300px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>Processing Operations Target Queue</h3>
        
        <div style={{ maxHeight: '320px', overflowY: 'auto', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          {candidates.map((c, i) => (
            <div 
              key={i} 
              onClick={() => setActiveIndex(i)} 
              style={{ 
                padding: '12px', 
                borderBottom: '1px solid #e2e8f0', 
                cursor: 'pointer', 
                background: activeIndex === i ? '#dbeafe' : 'white',
                borderLeft: activeIndex === i ? `4px solid ${themeColor}` : '4px solid transparent',
                transition: 'all 0.1s ease'
              }}
            >
              <strong style={{ color: '#0f172a' }}>{c.name || 'Null Item'}</strong>
              <br/>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{c.email}</span>
            </div>
          ))}
        </div>

        <hr style={{ margin: '20px 0', borderColor: '#e5e7eb' }} />
        
        <button 
          onClick={handleDispatch} 
          style={{ width: '100%', background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'block', marginBottom: '8px' }}
        >
          Send PDF via Gmail SMTP
        </button>
        
        <button 
          onClick={() => window.print()} 
          style={{ width: '100%', background: '#4b5563', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'block' }}
        >
          Download PDF Copy
        </button>
        
        {status && (
          <p style={{ padding: '12px', background: '#f3f4f6', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '12px', fontSize: '13px', lineHeight: '1.4', wordBreak: 'break-word', color: '#334155' }}>
            {status}
          </p>
        )}
      </div>

      {/* ================= RIGHT PREVIEW SCREEN WORKSPACE ================= */}
      <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '12px', color: '#475569', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Interactive Document Preview Engine
          </span>
          
          <div style={{ display: 'flex', background: '#cbd5e1', padding: '2px', borderRadius: '6px' }}>
            <button 
              onClick={() => setPreviewMode('mail')}
              style={{ padding: '6px 14px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', background: previewMode === 'mail' ? 'white' : 'transparent', color: previewMode === 'mail' ? '#0f172a' : '#64748b', transition: 'all 0.1s' }}
            >
              ✉️ Mail View
            </button>
            <button 
              onClick={() => setPreviewMode('pdf')}
              style={{ padding: '6px 14px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', background: previewMode === 'pdf' ? 'white' : 'transparent', color: previewMode === 'pdf' ? '#0f172a' : '#64748b', transition: 'all 0.1s' }}
            >
              📄 PDF View
            </button>
          </div>
        </div>

        {/* 📬 PREVIEW CONTAINER SLOTS */}
        {previewMode === 'mail' ? (
          /* --- ✉️ OUTBOUND MAIL PREVIEW LAYOUT --- */
          <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', background: '#ffffff', minHeight: '550px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            
            <div style={{ background: '#f8fafc', padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '70px', fontSize: '13px', fontWeight: 'bold', color: '#64748b' }}>To:</span>
                <span style={{ fontSize: '13px', color: '#1e293b', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                  {currentCandidate.email || 'no-recipient@selected.queue'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '70px', fontSize: '13px', fontWeight: 'bold', color: '#64748b' }}>Subject:</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                  {emailSubject}
                </span>
              </div>
            </div>

            {/* Email Message Content Envelope */}
            <div style={{ padding: '24px' }}>
              <div style={{ whiteSpace: 'pre-line', fontSize: '14px', color: '#334155', padding: '16px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '24px', lineHeight: '1.6' }}>
                {mailBodyMessage}
              </div>
              
              {/* Simulated Download attachment footer link slot representing attachment position */}
              <div style={{ padding: '12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>📎</span>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b', display: 'block' }}>Internship_Offer_{currentCandidate.name || 'Candidate'}.pdf</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Automated PDF Asset Layout Document</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* --- 📄 STANDALONE PDF CANVAS PREVIEW LAYOUT --- */
          <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '24px', background: '#94a3b8', minHeight: '550px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div style={{ background: '#ffffff', width: '100%', maxWidth: '650px', padding: '20px', borderRadius: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', boxSizing: 'border-box' }}>
              {/* Dynamic fully rendered page setup with surrounding template styles applies instantly here */}
              <div dangerouslySetInnerHTML={{ __html: activeFullTemplateHtml }} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
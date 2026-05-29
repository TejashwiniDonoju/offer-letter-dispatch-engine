import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Standard editor toolbar styles

export default function Step4Customize({ htmlContent, setHtmlContent, onNext, onPrev }) {
  const [activeEditor, setActiveEditor] = useState('text'); // 'text' (Rich Quill Sheet) or 'html' (Raw Markup)
  const [selectedLogo, setSelectedLogo] = useState('xyzon'); // 'xyzon' or 'aicte'
  const [emailSubject, setEmailSubject] = useState('Your Internship Offer — {Role} at Xyzon Innovations');
  const [selectedTemplate, setSelectedTemplate] = useState('software-intern');

  // Style Matrix Toggles
  const [themeColor, setThemeColor] = useState('#1e3a8a'); // Dynamic Corporate Accent
  const [layoutStyle, setLayoutStyle] = useState('modern'); // 'modern', 'classic', 'minimal'

  // Pre-configured rich document templates matrix
  const templates = {
    'software-intern': `
      <h2 style="color: #1e3a8a; font-family: sans-serif;">XYZON INNOVATIONS PRIVATE LIMITED</h2>
      <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">Dear <strong>{{name}}</strong>,</p>
      <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">We are pleased to offer you an Internship position as a <strong>Software Engineering Intern</strong> at Xyzon Innovations. Your training window will focus on full-stack pipeline automation systems.</p>
      <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">During this tenure, you will receive a standard stipend configuration as agreed upon during your technical evaluation panel.</p>
      <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6;"><br>Sincerely,<br><strong>Human Resources Team</strong></p>
    `,
    'marketing-intern': `
      <h2 style="color: #1e3a8a; font-family: sans-serif;">XYZON INNOVATIONS PRIVATE LIMITED</h2>
      <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">Dear <strong>{{name}}</strong>,</p>
      <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">We are pleased to offer you an Internship position as a <strong>Digital Marketing Intern</strong> at Xyzon Innovations. Your core operations will include scaling our product reach metrics.</p>
      <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">During this tenure, you will receive a standard stipend configuration as agreed upon during your evaluation panel.</p>
      <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6;"><br>Sincerely,<br><strong>Human Resources Team</strong></p>
    `
  };

  // Initialize or swap base text when dropdown selector fires
  useEffect(() => {
    setHtmlContent(templates[selectedTemplate]);
  }, [selectedTemplate]);

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(htmlContent);
    alert("Raw HTML markup structure copied to your system clipboard!");
  };

  const handleReset = () => {
    if (window.confirm("Revert your working document back to the base template text layout?")) {
      setHtmlContent(templates[selectedTemplate]);
    }
  };

  // ReactQuill configuration toolbar modules setup
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  // Dynamic wrapper styles to change layout format without replacing internal quill text data
  const getPageStyles = () => {
    if (layoutStyle === 'classic') {
      return {
        border: `3px double ${themeColor}`,
        fontFamily: 'Georgia, serif',
        borderRadius: '0px',
        padding: '50px 40px'
      };
    }
    if (layoutStyle === 'minimal') {
      return {
        border: 'none',
        borderTop: `4px solid ${themeColor}`,
        boxShadow: 'none',
        padding: '24px'
      };
    }
    // Default 'modern' template style configurations
    return {
      border: '1px solid #cbd5e1',
      borderTop: `8px solid ${themeColor}`,
      borderRadius: '8px',
      padding: '40px'
    };
  };

  return (
    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '950px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* 🚀 Step Control Strip Header Panel Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ background: '#2563eb', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</span>
          <h3 style={{ margin: 0, color: '#1e293b' }}>Customize Template Layout</h3>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => alert('Changes cached safely.')} style={{ padding: '6px 14px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>📁 Save</button>
          <button onClick={handleCopyRaw} style={{ padding: '6px 14px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>📋 Copy HTML</button>
          <button onClick={handleReset} style={{ padding: '6px 14px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}>🔄 Reset</button>
        </div>
      </div>

      <hr style={{ borderColor: '#e2e8f0', margin: '16px 0' }} />

      {/* 🎨 Live Formatting Design Engine Toolbar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', background: '#f1f5f9', padding: '16px', borderRadius: '8px' }}>
        {/* Style / Format Selector Toggle */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>📐 Format Style</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['modern', 'classic', 'minimal'].map((style) => (
              <button
                key={style}
                onClick={() => setLayoutStyle(style)}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', textTransform: 'capitalize', background: layoutStyle === style ? '#0f172a' : 'white', color: layoutStyle === style ? 'white' : '#334155' }}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Color Hex Matrix controls */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>🎨 Primary Accent Theme Color</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', height: '36px' }}>
            {['#1e3a8a', '#ea580c', '#10b981', '#6366f1'].map((color) => (
              <div
                key={color}
                onClick={() => setThemeColor(color)}
                style={{ width: '24px', height: '24px', borderRadius: '50%', background: color, cursor: 'pointer', border: themeColor === color ? '2px solid #000' : '1px solid rgba(0,0,0,0.2)', transform: themeColor === color ? 'scale(1.1)' : 'none', transition: 'transform 0.1s' }}
              />
            ))}
            <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} style={{ width: '28px', height: '28px', border: 'none', padding: 0, cursor: 'pointer', background: 'transparent' }} />
          </div>
        </div>
      </div>

      {/* 📋 Template Loader Dropdowns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>🗂️ Select Base Offer Template</label>
          <select 
            value={selectedTemplate} 
            onChange={(e) => setSelectedTemplate(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', fontSize: '14px', outline: 'none' }}
          >
            <option value="software-intern">Software Engineering Internship Offer Template</option>
            <option value="marketing-intern">Digital Marketing Specialist Internship Template</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>✉️ Outbound Email Subject</label>
          <input 
            type="text" 
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
      </div>

      {/* 📄 PDF Logo Selection Selector Row with IMAGE Previews */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>📄 Choose PDF Watermark Logo Option</label>
        <div style={{ display: 'flex', gap: '16px' }}>
          
          <div 
            onClick={() => setSelectedLogo('xyzon')} 
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: selectedLogo === 'xyzon' ? '2px solid #2563eb' : '1px solid #cbd5e1', background: selectedLogo === 'xyzon' ? '#eff6ff' : 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
          >
            <img src="/xyzon_logo.png" alt="Xyzon" style={{ height: '35px', objectFit: 'contain' }} onError={(e)=>{e.target.style.display='none'}}/>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>🏢 Xyzon Corporate Logo</span>
          </div>

          <div 
            onClick={() => setSelectedLogo('aicte')} 
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: selectedLogo === 'aicte' ? '2px solid #ea580c' : '1px solid #cbd5e1', background: selectedLogo === 'aicte' ? '#fff7ed' : 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
          >
            <img src="/aicte_logo.png" alt="AICTE" style={{ height: '35px', objectFit: 'contain' }} onError={(e)=>{e.target.style.display='none'}}/>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>☀️ AICTE Academic Badge</span>
          </div>

        </div>
      </div>

      {/* 🛠️ Editor View Toggles */}
      <div style={{ display: 'flex', borderBottom: '1px solid #cbd5e1', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveEditor('text')}
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeEditor === 'text' ? '2px solid #2563eb' : 'none', fontWeight: 'bold', color: activeEditor === 'text' ? '#2563eb' : '#64748b', cursor: 'pointer' }}
        >
          📝 Rich Text Editor (Inside PDF Sheet Mockup)
        </button>
        <button 
          onClick={() => setActiveEditor('html')}
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeEditor === 'html' ? '2px solid #2563eb' : 'none', fontWeight: 'bold', color: activeEditor === 'html' ? '#2563eb' : '#64748b', cursor: 'pointer' }}
        >
          💻 Raw HTML Markup Code Editor
        </button>
      </div>

      {/* 📬 THE SHEET INTERACTIVE FIELD WORKSPACE CONTAINERS */}
      {activeEditor === 'text' ? (
        /* Dynamic Visual PDF Page mockup container matrix applying customized styles */
        <div style={{ background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative', minHeight: '600px', boxSizing: 'border-box', transition: 'all 0.2s', ...getPageStyles() }}>
          
          {/* Top Custom Theme Color Decorative Margin Bar (Only displays when in default modern layout style) */}
          {layoutStyle === 'modern' && (
            <div style={{ background: themeColor, height: '8px', width: '100%', top: 0, left: 0, position: 'absolute', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }} />
          )}
          
          {/* Top Logo Watermark Render Area inside sheet frame */}
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: layoutStyle === 'classic' ? 'center' : 'flex-start' }}>
            <img src={selectedLogo === 'xyzon' ? "/xyzon_logo.png" : "/aicte_logo.png"} alt="Header Brand Logo" style={{ height: '40px', objectFit: 'contain' }} onError={(e)=>{e.target.style.display='none'}}/>
          </div>

          {/* 🌟 REACT QUILL INLINE COMPONENT EDITOR */}
          <div className="pdf-quill-wrapper" style={{ minHeight: '400px', border: 'none' }}>
            <ReactQuill 
              theme="snow"
              value={htmlContent}
              onChange={setHtmlContent}
              modules={quillModules}
              style={{ height: '350px', border: 'none' }}
            />
          </div>

          {/* Bottom Stamp Placement Indicator displaying toggle status live on the editing page layout sheet */}
          <div style={{ borderTop: '1px dashed #cbd5e1', marginTop: '40px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>SYSTEM SECURITY TRACK CODE</span>
              <strong style={{ fontSize: '11px', color: '#475569', fontFamily: 'monospace' }}>XYZ-INT-2026-991A</strong>
            </div>
            
            <div>
              <span style={{ fontSize: '11px', color: themeColor, fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'monospace' }}>Verified Document</span>
            </div>
          </div>

        </div>
      ) : (
        /* Alternative Developer Raw View Workspace Code Canvas */
        <div>
          <textarea 
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            style={{ width: '100%', minHeight: '500px', padding: '16px', borderRadius: '8px', border: '1px solid #0f172a', fontFamily: 'Courier New, monospace', fontSize: '13px', background: '#0f172a', color: '#38bdf8', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }}
          />
        </div>
      )}

      {/* Steps Navigation Control Elements Ribbon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
        <button onClick={onPrev} style={{ padding: '10px 20px', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          ← Back to Review Queue
        </button>
        <button onClick={onNext} style={{ padding: '10px 24px', background: themeColor, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
          Proceed to Step 5 Review →
        </button>
      </div>

      {/* Quick custom styles rule to hide ReactQuill's gray bounding borders inside our mockup sheet */}
      <style>{`
        .pdf-quill-wrapper .ql-container.ql-snow { border: none !important; font-size: 15px; color: #1e293b; }
        .pdf-quill-wrapper .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #f1f5f9 !important; margin-bottom: 12px; }
      `}</style>

    </div>
  );
}
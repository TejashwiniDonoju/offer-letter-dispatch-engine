import React, { useState } from 'react';
import axios from 'axios';

export default function Step3Review({ 
  candidates, 
  headers, 
  apiBase, 
  htmlContent, 
  onUpdateCandidate, 
  onAddCandidate, 
  onNextStep 
}) {
  const [selectedRows, setSelectedRows] = useState(
    candidates.reduce((acc, _, idx) => ({ ...acc, [idx]: true }), {})
  );
  const [bulkStatus, setBulkStatus] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Auto-select newly added rows
  const handleAddNewRowClick = () => {
    if (typeof onAddCandidate === 'function') {
      onAddCandidate();
      setSelectedRows(prev => ({
        ...prev,
        [candidates.length]: true
      }));
    }
  };

  const toggleSelectAll = (isChecked) => {
    const updatedSelections = {};
    candidates.forEach((_, idx) => {
      updatedSelections[idx] = isChecked;
    });
    setSelectedRows(updatedSelections);
  };

  const toggleRow = (rowIndex, isChecked) => {
    setSelectedRows(prev => ({
      ...prev,
      [rowIndex]: isChecked
    }));
  };

  // 📝 Helper function to replace {{tags}} with actual candidate data info
  const compileLetterHtml = (template, data) => {
    if (!template) return '';
    let result = template;
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, data[key] || '');
    });
    return result;
  };

  // 🚀 AUTOMATED BULK DISPATCH ENGINE
  const handleSendAllEmails = async () => {
    const activeTargets = candidates.filter((_, idx) => selectedRows[idx]);

    if (activeTargets.length === 0) {
      return alert('Please select at least one candidate checkbox to send emails.');
    }

    const confirmDispatch = window.confirm(`Are you sure you want to blast personalized offer letter emails to all ${activeTargets.length} selected recipients right now?`);
    if (!confirmDispatch) return;

    setIsSending(true);
    setBulkStatus('Initializing bulk SMTP automation channels...');

    let successCount = 0;
    let failureCount = 0;

    // Run through the list sequentially to avoid overwhelming SMTP connections
    for (let i = 0; i < activeTargets.length; i++) {
      const candidate = activeTargets[i];
      
      // Verification safety gate check
      if (!candidate.email || !candidate.name) {
        failureCount++;
        continue;
      }

      setBulkStatus(`Processing execution queue [${i + 1}/${activeTargets.length}]: Sending to ${candidate.name}...`);

      try {
        // Compile individualized HTML tags dynamically on the fly for each specific person
        const personalizedLetterHtml = compileLetterHtml(htmlContent, candidate);

        // Pre-build your descriptive email message body configuration text
        const mailBodyMessage = `Hello ${candidate.name},\n\nWe are pleased to inform you that your selection process is complete. Your formal offer configuration letter details have been calculated and are attached to the bottom of this message container.\n\nBest regards,\nOperations Management Team`;

        const targetBackendUrl = apiBase || 'http://localhost:5000';
        
        // Push the payload structure to your backend API route
        await axios.post(`${targetBackendUrl}/api/dispatch`, {
          email: candidate.email,
          name: candidate.name,
          subject: "Official Appointment & Offer Letter Package Confirmation",
          messageBody: mailBodyMessage,
          htmlContent: personalizedLetterHtml
        });

        successCount++;
      } catch (err) {
        console.error(`Failed sending to candidate: ${candidate.email}`, err);
        failureCount++;
      }
    }

    setIsSending(false);
    setBulkStatus(`🎉 Dispatch Complete! Success: ${successCount} sent | Failed: ${failureCount} rows.`);
    alert(`Bulk transmission complete!\nSuccessfully sent: ${successCount}\nFailures/Errors encountered: ${failureCount}`);
  };

  // 📥 Local backup file generator 
  const handleExportCSV = () => {
    const rowsToExport = candidates.filter((_, idx) => selectedRows[idx]);
    if (rowsToExport.length === 0) return alert('No active rows selected to export.');

    const csvHeaders = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
    const csvRows = rowsToExport.map(candidate => {
      return headers.map(header => {
        const key = header.toLowerCase();
        const cellValue = candidate[key] !== undefined ? String(candidate[key]) : '';
        return `"${cellValue.replace(/"/g, '""')}"`;
      }).join(',');
    });

    const blob = new Blob([[csvHeaders, ...csvRows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', 'modified_candidates.csv');
    downloadAnchor.click();
  };

  const allSelected = candidates.length > 0 && candidates.every((_, idx) => selectedRows[idx]);

  return (
    <div style={{ boxSizing: 'border-box', width: '100%', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', fontFamily: 'sans-serif' }}>
      
      {/* Upper Header Control Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ margin: 0, color: '#1e293b' }}>Step 3: Review & Edit Candidate Data Matrix</h3>
        
        <button 
          onClick={() => { if (typeof onNextStep === 'function') onNextStep(); }} 
          style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Skip to Style Customizer ➜
        </button>
      </div>

      {/* 🛠️ BULK AUTOMATION ENGINE CONTROL WORKSPACE PANEL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Left Side: Adding Rows & Triggering the Bulk Dispatch */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleAddNewRowClick}
            disabled={isSending}
            style={{ padding: '10px 16px', background: 'white', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '6px', fontWeight: '600', cursor: isSending ? 'not-allowed' : 'pointer' }}
          >
            ➕ Add New Candidate Row
          </button>

          <button 
            onClick={handleSendAllEmails}
            disabled={isSending}
            style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isSending ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {isSending ? '⏳ Transmitting...' : '🚀 Send Bulk Emails to All Selected'}
          </button>
        </div>

        {/* Right Side: Selection Filters & CSV Backup Downloader */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => toggleSelectAll(false)}
            disabled={isSending}
            style={{ padding: '8px 14px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
          >
            ❌ Deselect All
          </button>
          <button 
            onClick={handleExportCSV}
            disabled={isSending}
            style={{ padding: '8px 14px', background: '#4b5563', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
          >
            📥 Export CSV File
          </button>
        </div>

      </div>

      {/* 📡 Live Status Processing Progress Update Tracker Banner */}
      {bulkStatus && (
        <div style={{ padding: '12px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', color: '#1e40af', fontSize: '13px', fontWeight: '600', marginBottom: '16px', lineHeight: '1.5' }}>
          {bulkStatus}
        </div>
      )}

      {/* Table Data Matrix Grid Box */}
      <div style={{ width: '100%', overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '14px 20px', width: '40px' }}>
                <input 
                  type="checkbox"
                  checked={allSelected}
                  disabled={isSending}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                />
              </th>
              {headers.map((header) => (
                <th key={header} style={{ padding: '14px 20px', textTransform: 'uppercase', color: '#475569', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {candidates.map((candidate, rowIndex) => (
              <tr key={candidate._id || rowIndex} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: selectedRows[rowIndex] ? 'transparent' : '#f8fafc', opacity: selectedRows[rowIndex] ? 1 : 0.7 }}>
                <td style={{ padding: '10px 20px' }}>
                  <input 
                    type="checkbox"
                    checked={!!selectedRows[rowIndex]}
                    disabled={isSending}
                    onChange={(e) => toggleRow(rowIndex, e.target.checked)}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                </td>

                {headers.map((header) => {
                  const key = header.toLowerCase();
                  return (
                    <td key={key} style={{ padding: '10px 14px' }}>
                      <input
                        type="text"
                        value={candidate[key] || ''}
                        disabled={!selectedRows[rowIndex] || isSending}
                        placeholder={`Enter ${key}...`}
                        onChange={(e) => onUpdateCandidate(rowIndex, key, e.target.value)}
                        style={{ boxSizing: 'border-box', width: '180px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', color: '#334155', backgroundColor: selectedRows[rowIndex] ? '#fefefe' : '#f1f5f9', outline: 'none' }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
import React from 'react';
import axios from 'axios';

export default function Step2Upload({ onUploadSuccess, apiBase }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target.result;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return alert('Invalid spreadsheet formatting pattern.');

      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(row => {
        const values = row.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((h, i) => { obj[h.toLowerCase()] = values[i] || ''; });
        return obj;
      }).filter(row => row.name && row.email); // 🌟 Drops empty or corrupted tail rows cleanly

      // Find this section inside your Step2Upload.jsx file:

      // Change only the axios.post line inside your reader.onload execution block:
try {
  const response = await axios.post(`${apiBase}/api/candidates`, { candidates: rows });
  onUploadSuccess(headers, response.data.data);
} catch (err) {
  const errorMessage = err.response?.data?.details || err.response?.data?.error || err.message;
  alert(`Upload Failed: ${errorMessage}`);
}
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <h3>Upload Candidate Manifest File (.csv)</h3>
      <input type="file" accept=".csv" onChange={handleFile} style={{ padding: '20px', border: '2px dashed #cbd5e1', borderRadius: '8px' }} />
    </div>
  );
}
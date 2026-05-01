import { useState } from 'react';
import { importCounsellors, importTimetable } from '../../api/import.js';
import { toast } from 'react-toastify';
import '../../styles/imports.css';

export default function AdminImport(){
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [busy, setBusy] = useState(false);

  const onImportCounsellors = async ()=>{
    if (!file1) return toast.error('Select a file');
    setBusy(true);
    try{
      const res = await importCounsellors(file1);
      toast.success(`Imported counsellors: ${res.count||0}`);
      setFile1(null);
    }catch(e){ /* toast handled */ }
    setBusy(false);
  };

  const onImportTimetable = async ()=>{
    if (!file2) return toast.error('Select a file');
    setBusy(true);
    try{
      const res = await importTimetable(file2);
      toast.success(`Timetable rows stored: ${res.inserted||0}`);
      setFile2(null);
    }catch(e){ /* toast handled */ }
    setBusy(false);
  };

  return (
    <div className="imports-container">
      <div className="imports-header">
        <h2>Imports</h2>
      </div>
      
      <div className="imports-grid">
        <div className="import-card">
          <div className="import-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3>Import Counsellors</h3>
          <p className="import-description">
            Upload XLSX with columns: Department, Year, Name, Email, Role (optional), Institute (optional).
          </p>
          
          <div className="file-upload-wrapper">
            <input 
              type="file" 
              id="counsellor-file"
              accept=".xlsx,.xls" 
              onChange={e=>setFile1(e.target.files?.[0]||null)}
              className="file-input"
            />
            <label htmlFor="counsellor-file" className="file-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              {file1 ? file1.name : 'Choose File'}
            </label>
          </div>
          
          <button 
            className="upload-btn" 
            disabled={!file1||busy} 
            onClick={onImportCounsellors}
          >
            {busy ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        <div className="import-card">
          <div className="import-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h3>Import Timetable</h3>
          <p className="import-description">
            Upload XLSX with columns: Department, Year, Semester (opt), Day, Start, End, Subject, Teacher, TeacherEmail (opt), Room.
          </p>
          
          <div className="file-upload-wrapper">
            <input 
              type="file" 
              id="timetable-file"
              accept=".xlsx,.xls" 
              onChange={e=>setFile2(e.target.files?.[0]||null)}
              className="file-input"
            />
            <label htmlFor="timetable-file" className="file-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              {file2 ? file2.name : 'Choose File'}
            </label>
          </div>
          
          <button 
            className="upload-btn" 
            disabled={!file2||busy} 
            onClick={onImportTimetable}
          >
            {busy ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}


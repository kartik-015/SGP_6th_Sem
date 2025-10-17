import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1 style={{ fontSize: 56, margin: 0 }}>404</h1>
      <h2 style={{ marginTop: 8 }}>Page Not Found</h2>
      <p style={{ color: '#6b7280' }}>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{ marginTop: 18, display:'flex', gap:10, justifyContent:'center' }}>
        <Link to="/" className="btn">Home</Link>
        <Link to="/equipment" className="btn">Browse Equipment</Link>
      </div>
    </div>
  );
}

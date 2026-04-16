import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <div className="d-flex" style={{ height: '100vh', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px 48px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
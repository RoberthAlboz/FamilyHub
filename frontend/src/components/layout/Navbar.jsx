import React from 'react';

function Navbar() {
  return (
    <header className="d-flex justify-content-between align-items-center" style={{ height: '60px', padding: '0 32px', borderBottom: '1px solid #edece9', backgroundColor: '#ffffff' }}>
      <div style={{ position: 'relative', width: '300px' }}>
        <input 
          type="text" 
          placeholder="Pesquisar..." 
          style={{ width: '100%', padding: '6px 12px 6px 32px', backgroundColor: '#f7f7f5', border: '1px solid transparent', borderRadius: '4px', color: '#37352f', outline: 'none', fontSize: '14px' }}
          onFocus={(e) => e.target.style.border = '1px solid #cfcecc'}
          onBlur={(e) => e.target.style.border = '1px solid transparent'}
        />
        <span style={{ position: 'absolute', left: '10px', top: '7px', fontSize: '14px', opacity: 0.5 }}>🔍</span>
      </div>

      <div style={{ width: '32px', height: '32px', backgroundColor: '#f472b6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
        FH
      </div>
    </header>
  );
}

export default Navbar;
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#fafafa'
      }}
    >
      <Sidebar />

      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Navbar />

        <main
          style={{
            padding: '32px',
            flexGrow: 1,
            overflowY: 'auto'
          }}
        >
          {/* O Outlet é essencial para renderizar as rotas filhas definidas no App.jsx */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout() {
  const { isDarkMode } = useTheme();

  const themeStyles = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f5e8ff',
    color: isDarkMode ? '#' : '#37352f',
    transition: 'all 0.3s ease'
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        ...themeStyles
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
          <Outlet context={{ isDarkMode }} />
        </main>
      </div>

      <style>{`
        /* Scrollbar Moderna */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#1a1a1a' : '#fafafa'};
        }

        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#505050' : '#d0d0d0'};
          border-radius: 4px;
          transition: background 0.3s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#707070' : '#b0b0b0'};
        }

        /* Firefox */
        * {
          scrollbar-color: ${isDarkMode ? '#505050' : '#875d86'} ${isDarkMode ? '#1a1a1a' : '#e8b1f7'};
          scrollbar-width: thin;
        }

        .dark-mode {
          background-color: #1a1a1a !important;
          color: #ffffff !important;
        }
        
        .dark-mode .card, 
        .dark-mode .modal-content, 
        .dark-mode .fh-card,
        .dark-mode .p-3,
        .dark-mode .shadow-sm {
          background-color: #2d2d2d !important;
          color: #ffffff !important;
          border-color: #404040 !important;
        }
        
        .dark-mode input[type="text"],
        .dark-mode input[type="date"],
        .dark-mode input[type="email"],
        .dark-mode input[type="password"],
        .dark-mode input[type="number"],
        .dark-mode select, 
        .dark-mode textarea {
          background-color: #333 !important;
          color: #fff !important;
          border-color: #444 !important;
        }
        
        .dark-mode input::placeholder {
          color: #aaa !important;
        }
        
        .dark-mode .text-muted {
          color: #aaa !important;
        }
        
        .dark-mode .bg-light {
          background-color: #333 !important;
        }
        
        .dark-mode .border,
        .dark-mode .border-bottom,
        .dark-mode .border-top,
        .dark-mode .border-start,
        .dark-mode .border-end {
          border-color: #404040 !important;
        }
        
        .dark-mode .form-control:focus,
        .dark-mode .form-select:focus {
          border-color: #0d6efd !important;
          background-color: #333 !important;
          color: #fff !important;
        }

        /* Ícones em modo escuro */
        .dark-mode .bi {
          color: inherit;
        }
      `}</style>
    </div>
  );
}

export default Layout;

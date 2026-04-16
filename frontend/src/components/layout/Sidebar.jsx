import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => navigate('/login');
  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? '#37352f' : '#73726e', 
    backgroundColor: isActive(path) ? '#e9e9e8' : 'transparent', 
    border: 'none', 
    padding: '6px 12px', 
    borderRadius: '4px', 
    fontWeight: isActive(path) ? '500' : '400',
    textDecoration: 'none',
    display: 'block'
  });

  return (
    <aside style={{ width: '240px', backgroundColor: '#f7f7f5', borderRight: '1px solid #edece9', display: 'flex', flexDirection: 'column', padding: '16px 12px', height: '100vh' }}>
      <div className="mb-4 px-2 d-flex align-items-center gap-2" style={{ fontWeight: '600', color: '#37352f' }}>
        <div style={{ width: '24px', height: '24px', backgroundColor: '#e9e9e8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>F</div>
        FamilyHub
      </div>

      <nav className="d-flex flex-column gap-1 flex-grow-1">
        <Link to="/dashboard" className="btn btn-sm text-start w-100" style={linkStyle('/dashboard')}>🏠 Dashboard</Link>
        <Link to="/tarefas" className="btn btn-sm text-start w-100" style={linkStyle('/tarefas')}>📋 Tarefas</Link>
        <button className="btn btn-sm text-start w-100" style={{ color: '#73726e', border: 'none', padding: '6px 12px' }}>💰 Finanças</button>
        <button className="btn btn-sm text-start w-100" style={{ color: '#73726e', border: 'none', padding: '6px 12px' }}>🗓️ Calendário</button>
      </nav>

      <div className="mt-auto pt-3 border-top" style={{ borderColor: '#edece9' }}>
        <button onClick={handleLogout} className="btn btn-sm text-start w-100" style={{ color: '#73726e', border: 'none', padding: '6px 12px' }}>Log out</button>
      </div>
    </aside>
  );
}

export default Sidebar;
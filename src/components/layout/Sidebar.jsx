import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  BookOpen, 
  FileCheck, 
  User, 
  X 
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser } = useApp();
  const isInstructor = currentUser?.rol === 'instructor';

  const instructorLinks = [
    { to: '/instructor/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/instructor/calificar', label: 'Calificar Evidencias', icon: <CheckSquare size={20} /> },
    { to: '/instructor/reportes', label: 'Generar Reportes', icon: <BarChart3 size={20} /> }
  ];

  const apprenticeLinks = [
    { to: '/aprendiz/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/aprendiz/actividades', label: 'Actividades', icon: <BookOpen size={20} /> },
    { to: '/aprendiz/evidencias', label: 'Mis Evidencias', icon: <FileCheck size={20} /> }
  ];

  const links = isInstructor ? instructorLinks : apprenticeLinks;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''} no-print`}>
      <div className="sidebar-header">
        <div className="sena-logo-icon"></div>
        <span className="logo-text">SENA</span>
        <button className="sidebar-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-card">
          <div className="avatar-wrapper">
            <img 
              src={currentUser?.avatarUrl} 
              alt={currentUser?.nombre} 
              className="user-card-avatar"
            />
          </div>
          <div className="user-card-info">
            <span className="user-card-name">{currentUser?.nombre}</span>
            <span className="user-card-email">{currentUser?.email}</span>
          </div>
        </div>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          z-index: 100;
          transition: transform var(--transition-normal);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem;
          height: 70px;
          border-bottom: 1px solid var(--border-color);
        }

        .sidebar-close-btn {
          display: none;
          color: var(--text-secondary);
          margin-left: auto;
          cursor: pointer;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-primary);
        }

        .sidebar-link.active {
          background: var(--accent-primary-glow);
          color: var(--accent-primary);
          font-weight: 500;
          box-shadow: inset 0 0 10px rgba(99, 102, 241, 0.05);
          border-left: 3px solid var(--accent-primary);
          padding-left: calc(1rem - 3px);
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border-color);
        }

        .sidebar-user-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          padding: 0.75rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .avatar-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--bg-primary);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-card-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-card-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-card-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-card-email {
          font-size: 0.7rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
            box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
          }
          .sidebar-close-btn {
            display: block;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;

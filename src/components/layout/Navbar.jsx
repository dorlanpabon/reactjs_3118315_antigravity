import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, User, LogOut, RefreshCw, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { currentUser, logout, notifications, markNotificationRead, resetDatabase } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter notifications for the current logged in user
  const userNotifications = notifications.filter(
    (n) => n.usuarioId === currentUser?.id
  );
  
  const unreadCount = userNotifications.filter((n) => !n.leida).length;

  const handleNotificationClick = (id) => {
    markNotificationRead(id);
  };

  const handleReset = () => {
    if (window.confirm("¿Estás seguro de restablecer la base de datos a sus valores iniciales? Esto borrará tus cambios locales.")) {
      resetDatabase();
      alert("Base de datos restablecida con datos semilla.");
      window.location.reload();
    }
  };

  return (
    <header className="navbar-header no-print">
      <div className="navbar-left">
        <button className="menu-toggle-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="navbar-logo">
          <div className="sena-logo-icon"></div>
          <span className="logo-text">SENA <span className="logo-subtext">Calificaciones</span></span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Reset Database for evaluator */}
        <button 
          className="navbar-icon-btn reset-btn" 
          onClick={handleReset} 
          title="Restablecer Datos Semilla"
        >
          <RefreshCw size={18} />
          <span className="btn-label">Restablecer Demo</span>
        </button>

        {/* Notifications */}
        <div className="notifications-dropdown-container">
          <button 
            className="navbar-icon-btn position-relative" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notificaciones"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="glass-card notifications-menu">
              <div className="notifications-header">
                <h3>Notificaciones</h3>
                {unreadCount > 0 && <span className="badge badge-pendiente">{unreadCount} nuevas</span>}
              </div>
              <div className="notifications-list">
                {userNotifications.length === 0 ? (
                  <p className="no-notifications">No tienes notificaciones</p>
                ) : (
                  userNotifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${!notif.leida ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notif.id)}
                    >
                      <div className="notification-dot-container">
                        {!notif.leida && <span className="unread-dot"></span>}
                      </div>
                      <div className="notification-body">
                        <p>{notif.mensaje}</p>
                        <span className="notification-time">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info & Logout */}
        <div className="navbar-user-profile">
          <img 
            src={currentUser?.avatarUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=sena"} 
            alt={currentUser?.nombre} 
            className="navbar-avatar" 
          />
          <div className="navbar-user-details">
            <span className="navbar-username">{currentUser?.nombre}</span>
            <span className="navbar-user-role">{currentUser?.rol === 'instructor' ? 'Instructor' : 'Aprendiz'}</span>
          </div>
          <button className="navbar-logout-btn" onClick={logout} title="Cerrar Sesión">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .navbar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 2rem;
          background: rgba(15, 17, 30, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: 70px;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .menu-toggle-btn {
          display: none;
          cursor: pointer;
          color: var(--text-primary);
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sena-logo-icon {
          width: 32px;
          height: 32px;
          background: var(--accent-success);
          border-radius: 50%;
          position: relative;
        }

        .sena-logo-icon::before {
          content: '';
          position: absolute;
          width: 14px;
          height: 14px;
          background: var(--bg-primary);
          border-radius: 50%;
          top: 9px;
          left: 9px;
        }

        .logo-text {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #fff;
        }

        .logo-subtext {
          color: var(--accent-success);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .navbar-icon-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          padding: 0.5rem;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all var(--transition-fast);
          color: var(--text-primary);
        }

        .navbar-icon-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .reset-btn {
          color: var(--accent-warning);
          font-size: 0.85rem;
          padding: 0.5rem 0.75rem;
        }

        .position-relative {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--accent-danger);
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-secondary);
        }

        .notifications-dropdown-container {
          position: relative;
        }

        .notifications-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 10px);
          width: 350px;
          max-height: 400px;
          display: flex;
          flex-direction: column;
          padding: 0 !important;
          z-index: 101;
          overflow: hidden;
          background: rgba(15, 17, 30, 0.95) !important;
        }

        .notifications-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-color);
        }

        .notifications-header h3 {
          font-size: 1rem;
          margin: 0;
        }

        .notifications-list {
          overflow-y: auto;
          flex: 1;
        }

        .no-notifications {
          text-align: center;
          padding: 2rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .notification-item {
          display: flex;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .notification-item:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .notification-item.unread {
          background: rgba(99, 102, 241, 0.03);
        }

        .notification-dot-container {
          width: 20px;
          display: flex;
          align-items: center;
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          background: var(--accent-primary);
          border-radius: 50%;
          display: block;
        }

        .notification-body {
          flex: 1;
        }

        .notification-body p {
          font-size: 0.85rem;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .notification-time {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .navbar-user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-left: 1px solid var(--border-color);
          padding-left: 1.5rem;
        }

        .navbar-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--bg-card);
          border: 1.5px solid var(--border-color);
        }

        .navbar-user-details {
          display: flex;
          flex-direction: column;
        }

        .navbar-username {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .navbar-user-role {
          font-size: 0.75rem;
          color: var(--accent-success);
          font-weight: 500;
        }

        .navbar-logout-btn {
          color: var(--text-muted);
          cursor: pointer;
          transition: color var(--transition-fast);
          padding: 0.25rem;
        }

        .navbar-logout-btn:hover {
          color: var(--accent-danger);
        }

        @media (max-width: 1024px) {
          .menu-toggle-btn {
            display: block;
          }
          .navbar-user-details, .btn-label {
            display: none;
          }
          .navbar-user-profile {
            border-left: none;
            padding-left: 0;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

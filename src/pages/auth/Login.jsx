import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LogIn, User, Lock, AlertCircle, BookOpen } from 'lucide-react';

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = login(email, password);
      if (user.rol === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/aprendiz/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (role) => {
    if (role === 'instructor') {
      setEmail('instructor@sena.edu.co');
      setPassword('Sena2024*');
    } else {
      setEmail('juan.perez@sena.edu.co');
      setPassword('Sena2024*');
    }
  };

  return (
    <div className="login-wrapper fade-in-up">
      <div className="login-container glass-card">
        <div className="login-header">
          <div className="login-logo-circle">
            <BookOpen size={28} color="var(--accent-success)" />
          </div>
          <h2>Portal de Evidencias <span className="gradient-text-accent">SENA</span></h2>
          <p className="login-subtitle">Ingresa tus credenciales para acceder a la plataforma</p>
        </div>

        {error && (
          <div className="login-error-box">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="email"
                required
                className="form-control"
                placeholder="ejemplo@sena.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full login-btn">
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            <LogIn size={18} />
          </button>
        </form>

        <div className="demo-accounts-section">
          <span className="demo-title">Cuentas de Prueba (Demo)</span>
          <div className="demo-buttons">
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => handleAutofill('instructor')}
            >
              Demo Instructor
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => handleAutofill('aprendiz')}
            >
              Demo Aprendiz
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>¿No tienes una cuenta? <Link to="/register" className="register-link">Regístrate aquí</Link></p>
        </div>
      </div>

      <style>{`
        .login-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          padding: 1.5rem;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 40%);
        }

        .login-container {
          width: 100%;
          max-width: 440px;
          padding: 2.5rem !important;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-logo-circle {
          width: 56px;
          height: 56px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
        }

        .login-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .login-error-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--accent-danger);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .input-with-icon .form-control {
          padding-left: 2.75rem;
        }

        .w-full {
          width: 100%;
        }

        .login-btn {
          margin-top: 0.5rem;
        }

        .demo-accounts-section {
          margin-top: 2rem;
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
          text-align: center;
        }

        .demo-title {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 0.75rem;
        }

        .demo-buttons {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          border-radius: 8px;
        }

        .login-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .register-link {
          color: var(--accent-primary);
          font-weight: 600;
        }

        .register-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;

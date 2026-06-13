import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserPlus, User, Mail, Lock, Shield, GraduationCap, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register, courses } = useApp();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('aprendiz'); // 'aprendiz' or 'instructor'
  const [cursoId, setCursoId] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (rol === 'aprendiz' && !cursoId) {
      setError('Por favor, selecciona un curso.');
      return;
    }

    if (rol === 'instructor' && !especialidad) {
      setError('Por favor, indica tu área de especialidad.');
      return;
    }

    setLoading(true);
    try {
      register(nombre, email, password, rol, cursoId, especialidad);
      if (rol === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/aprendiz/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper fade-in-up">
      <div className="register-container glass-card">
        <div className="register-header">
          <div className="register-logo-circle">
            <UserPlus size={28} color="var(--accent-primary)" />
          </div>
          <h2>Crear Cuenta <span className="gradient-text">SENA</span></h2>
          <p className="register-subtitle">Regístrate para calificar o subir evidencias</p>
        </div>

        {error && (
          <div className="register-error-box">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                required
                className="form-control"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo Institucional</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
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

          <div className="form-group">
            <label className="form-label">Tipo de Usuario (Rol)</label>
            <div className="role-selector-group">
              <button
                type="button"
                className={`role-btn ${rol === 'aprendiz' ? 'active' : ''}`}
                onClick={() => setRol('aprendiz')}
              >
                <GraduationCap size={18} />
                <span>Aprendiz</span>
              </button>
              <button
                type="button"
                className={`role-btn ${rol === 'instructor' ? 'active' : ''}`}
                onClick={() => setRol('instructor')}
              >
                <Shield size={18} />
                <span>Instructor</span>
              </button>
            </div>
          </div>

          {/* Conditional field for Apprentice */}
          {rol === 'aprendiz' && (
            <div className="form-group fade-in-up">
              <label className="form-label">Curso / Ficha</label>
              <select
                className="form-control form-select"
                value={cursoId}
                onChange={(e) => setCursoId(e.target.value)}
              >
                <option value="">Selecciona tu ficha de formación</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} (Ficha: {c.ficha})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Conditional field for Instructor */}
          {rol === 'instructor' && (
            <div className="form-group fade-in-up">
              <label className="form-label">Área / Especialidad</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. Programación Frontend, Electrónica"
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary w-full register-btn">
            {loading ? 'Registrando...' : 'Registrar Cuenta'}
            <UserPlus size={18} />
          </button>
        </form>

        <div className="register-footer">
          <p>¿Ya tienes una cuenta? <Link to="/login" className="login-link">Inicia sesión</Link></p>
        </div>
      </div>

      <style>{`
        .register-wrapper {
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

        .register-container {
          width: 100%;
          max-width: 460px;
          padding: 2.5rem !important;
        }

        .register-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .register-logo-circle {
          width: 56px;
          height: 56px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
        }

        .register-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .register-subtitle {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .register-error-box {
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

        .role-selector-group {
          display: flex;
          gap: 0.75rem;
        }

        .role-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.01);
          cursor: pointer;
          transition: all var(--transition-fast);
          color: var(--text-secondary);
        }

        .role-btn.active {
          border-color: var(--accent-primary);
          background: var(--accent-primary-glow);
          color: var(--text-primary);
          font-weight: 600;
        }

        .role-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .w-full {
          width: 100%;
        }

        .register-btn {
          margin-top: 1rem;
        }

        .register-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .login-link {
          color: var(--accent-primary);
          font-weight: 600;
        }

        .login-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Register;

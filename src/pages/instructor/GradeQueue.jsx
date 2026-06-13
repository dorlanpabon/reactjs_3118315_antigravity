import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/ui/Badge';
import { Search, Filter, BookOpen, Clock, AlertTriangle } from 'lucide-react';

const GradeQueue = () => {
  const { currentUser, courses, users, activities, evidences } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('todos');
  const [selectedStatus, setSelectedStatus] = useState('todos');

  // Filter instructor courses
  const myCourses = courses.filter(c => c.instructorId === currentUser?.id);
  const myCourseIds = myCourses.map(c => c.id);

  // Filter activities and their evidences
  const myActivities = activities.filter(act => myCourseIds.includes(act.cursoId));
  const myActivityIds = myActivities.map(act => act.id);
  const myEvidences = evidences.filter(ev => myActivityIds.includes(ev.actividadId));

  // Handle filters
  const filteredEvidences = myEvidences.filter((ev) => {
    const student = users.find(u => u.id === ev.aprendizId);
    const act = activities.find(a => a.id === ev.actividadId);
    
    // 1. Search Query filter (matches apprentice name or email)
    const matchesSearch = student?.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student?.email.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Course filter
    const matchesCourse = selectedCourse === 'todos' || act?.cursoId === selectedCourse;

    // 3. Status filter
    const matchesStatus = selectedStatus === 'todos' || ev.estado === selectedStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  return (
    <div className="grade-queue-wrapper fade-in-up">
      <div className="section-header">
        <h2>Bandeja de Calificación</h2>
        <p className="text-secondary">Administra, filtra y evalúa las evidencias entregadas por tus aprendices</p>
      </div>

      {/* Filter panel */}
      <div className="glass-card filters-panel">
        <div className="search-bar-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Buscar aprendiz por nombre o correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-selects-row">
          <div className="filter-group-item">
            <Filter size={14} className="filter-lbl-icon" />
            <select
              className="form-control form-select select-sm"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="todos">Todos los Cursos</option>
              {myCourses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre} ({c.ficha})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group-item">
            <Filter size={14} className="filter-lbl-icon" />
            <select
              className="form-control form-select select-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="todos">Todos los Estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobado">Aprobados</option>
              <option value="deficiente">Deficientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queue results table */}
      <div className="queue-results-table">
        {filteredEvidences.length === 0 ? (
          <div className="glass-card queue-empty-state">
            <BookOpen size={48} color="var(--text-muted)" />
            <h3>No se encontraron evidencias</h3>
            <p>Prueba a ajustar tus filtros de búsqueda.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Aprendiz</th>
                  <th>Curso</th>
                  <th>Actividad</th>
                  <th>Fecha de Entrega</th>
                  <th>Calificación</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvidences.map((ev) => {
                  const student = users.find(u => u.id === ev.aprendizId);
                  const act = activities.find(a => a.id === ev.actividadId);
                  const course = courses.find(c => c.id === act?.cursoId);

                  return (
                    <tr key={ev.id}>
                      <td>
                        <div className="student-profile-cell">
                          <img 
                            src={student?.avatarUrl} 
                            alt={student?.nombre} 
                            className="mini-table-avatar" 
                          />
                          <div>
                            <strong>{student?.nombre}</strong>
                            <span className="email-lbl">{student?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="course-cell-data">
                          <span>{course?.nombre}</span>
                          <span className="ficha-lbl">Ficha: {course?.ficha}</span>
                        </div>
                      </td>
                      <td>
                        <div className="evidence-title-cell">
                          <strong>{act?.titulo}</strong>
                          {ev.entregaTardia && <span className="tardy-alert">Tardía</span>}
                        </div>
                      </td>
                      <td>{new Date(ev.fechaEntrega).toLocaleString()}</td>
                      <td>
                        <span className="grade-badge-value">
                          {ev.estado === 'pendiente' ? '--' : `${ev.notaFinal}/100`}
                        </span>
                      </td>
                      <td>
                        <Badge status={ev.estado} />
                      </td>
                      <td>
                        <button 
                          className={`btn btn-sm ${ev.estado === 'pendiente' ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => navigate(`/instructor/calificar/${ev.id}`)}
                        >
                          {ev.estado === 'pendiente' ? 'Calificar' : 'Reevaluar'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .grade-queue-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-header {
          margin-bottom: 0.5rem;
        }

        .filters-panel {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          padding: 1.25rem !important;
        }

        .search-bar-box {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-bar-box .form-control {
          padding-left: 2.75rem;
        }

        .filter-selects-row {
          display: flex;
          gap: 1rem;
        }

        .filter-group-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-color);
          padding: 0.25rem 0.75rem;
          border-radius: 10px;
        }

        .filter-lbl-icon {
          color: var(--text-muted);
        }

        .select-sm {
          border: none !important;
          background: transparent !important;
          padding: 0.25rem 1.5rem 0.25rem 0.25rem !important;
          font-size: 0.85rem;
          width: auto;
          box-shadow: none !important;
        }

        .queue-empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        }

        .queue-empty-state h3 {
          margin-top: 1rem;
          color: #fff;
        }

        .student-profile-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .mini-table-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }

        .email-lbl {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .course-cell-data span {
          display: block;
        }

        .ficha-lbl {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .evidence-title-cell strong {
          display: block;
        }

        .tardy-alert {
          background: var(--accent-danger-glow);
          color: var(--accent-danger);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          display: inline-block;
          margin-top: 0.2rem;
        }

        .grade-badge-value {
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .filters-panel {
            flex-direction: column;
            align-items: stretch;
          }
          .filter-selects-row {
            flex-direction: column;
          }
          .select-sm {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default GradeQueue;

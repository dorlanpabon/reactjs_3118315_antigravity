import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import KPICard from '../../components/ui/KPICard';
import Badge from '../../components/ui/Badge';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Clock, 
  Send, 
  ExternalLink,
  PlusCircle,
  X,
  FileCode2,
  HelpCircle
} from 'lucide-react';

const ApprenticeDashboard = () => {
  const { currentUser, courses, activities, evidences, submitEvidence } = useApp();
  const [activeTab, setActiveTab] = useState('pendientes'); // 'pendientes' | 'entregadas'
  const [selectedActivity, setSelectedActivity] = useState(null); // For submit modal
  const [formText, setFormText] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formFile, setFormFile] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Get current apprentice's course
  const myCourse = courses.find((c) => c.id === currentUser?.cursoId);
  
  // Get all activities of this course
  const courseActivities = activities.filter((act) => act.cursoId === myCourse?.id);
  
  // Get all evidences submitted by this apprentice
  const myEvidences = evidences.filter((ev) => ev.aprendizId === currentUser?.id);

  // Calculations
  const submittedActivityIds = myEvidences.map((ev) => ev.actividadId);
  const pendingActivities = courseActivities.filter((act) => !submittedActivityIds.includes(act.id));
  
  const gradedEvidences = myEvidences.filter((ev) => ev.estado !== 'pendiente');
  const avgGrade = gradedEvidences.length > 0
    ? Math.round(gradedEvidences.reduce((acc, curr) => acc + curr.notaFinal, 0) / gradedEvidences.length)
    : 0;

  const approvalRate = gradedEvidences.length > 0
    ? Math.round((gradedEvidences.filter((ev) => ev.estado === 'aprobado').length / gradedEvidences.length) * 100)
    : 0;

  const courseCompletion = courseActivities.length > 0
    ? Math.round((myEvidences.filter(ev => ev.estado === 'aprobado').length / courseActivities.length) * 100)
    : 0;

  const handleOpenSubmit = (activity) => {
    setSelectedActivity(activity);
    setFormText('');
    setFormLink('');
    setFormFile('');
    setSubmitSuccess(false);
  };

  const handleCloseSubmit = () => {
    setSelectedActivity(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    try {
      submitEvidence(
        selectedActivity.id,
        formText,
        formFile || 'evidencia_adjunta.zip',
        formLink
      );
      setSubmitSuccess(true);
      setTimeout(() => {
        handleCloseSubmit();
      }, 1500);
    } catch (err) {
      alert(err.message || 'Error al enviar la evidencia.');
    }
  };

  return (
    <div className="apprentice-dashboard-wrapper fade-in-up">
      {/* Banner */}
      <div className="glass-card dashboard-banner">
        <div className="banner-info">
          <div className="banner-badge">Ficha: {myCourse?.ficha || 'N/A'}</div>
          <h1>Bienvenido de nuevo, <span className="gradient-text">{currentUser?.nombre}</span></h1>
          <p className="course-name-title">
            <GraduationCap size={18} />
            {myCourse?.nombre || 'Curso no asignado'}
          </p>
        </div>
        
        {/* Circular Completion Ring */}
        <div className="completion-ring-box">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
            <circle 
              cx="40" 
              cy="40" 
              r="34" 
              stroke="var(--accent-success)" 
              strokeWidth="6" 
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - courseCompletion / 100)}`}
              strokeLinecap="round"
            />
            <text x="50%" y="54%" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">
              {courseCompletion}%
            </text>
          </svg>
          <span className="ring-label">Progreso Aprobado</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid-cols-4 metrics-grid">
        <KPICard
          title="Promedio General"
          value={`${avgGrade}/100`}
          icon={<CheckCircle size={22} />}
          description="Promedio de notas evaluadas"
          color="indigo"
        />
        <KPICard
          title="Actividades Entregadas"
          value={myEvidences.length}
          icon={<FileText size={22} />}
          description={`De un total de ${courseActivities.length}`}
          color="emerald"
        />
        <KPICard
          title="Tasa de Aprobación"
          value={`${approvalRate}%`}
          icon={<PlusCircle size={22} />}
          description="Evidencias aprobadas"
          color="sky"
        />
        <KPICard
          title="Pendientes por Entregar"
          value={pendingActivities.length}
          icon={<Clock size={22} />}
          description="Actividades sin subidas"
          color="amber"
        />
      </div>

      {/* Core Tabs */}
      <div className="dashboard-content-split">
        <div className="main-tab-panel glass-card">
          <div className="tab-header">
            <button 
              className={`tab-btn ${activeTab === 'pendientes' ? 'active' : ''}`}
              onClick={() => setActiveTab('pendientes')}
            >
              <HelpCircle size={18} />
              Actividades por Entregar ({pendingActivities.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'entregadas' ? 'active' : ''}`}
              onClick={() => setActiveTab('entregadas')}
            >
              <FileCode2 size={18} />
              Mis Evidencias Enviadas ({myEvidences.length})
            </button>
          </div>

          <div className="tab-body">
            {activeTab === 'pendientes' ? (
              pendingActivities.length === 0 ? (
                <div className="empty-state">
                  <CheckCircle size={48} color="var(--accent-success)" />
                  <h3>¡Todo al día!</h3>
                  <p>No tienes actividades pendientes por subir en este momento.</p>
                </div>
              ) : (
                <div className="activities-list">
                  {pendingActivities.map((act) => {
                    const isOverdue = new Date() > new Date(act.fechaLimite);
                    return (
                      <div key={act.id} className="activity-card glass-card">
                        <div className="activity-card-header">
                          <h4>{act.titulo}</h4>
                          <span className={`badge ${isOverdue ? 'badge-deficiente' : 'badge-pendiente'}`}>
                            {isOverdue ? 'Vencida' : 'Pendiente'}
                          </span>
                        </div>
                        <p className="activity-desc">{act.descripcion}</p>
                        <div className="activity-meta">
                          <span className="competence-badge">
                            <strong>Competencia:</strong> {act.competence || act.competencia || 'General'}
                          </span>
                          <div className="meta-right">
                            <span className="date-limit">
                              <strong>Límite:</strong> {new Date(act.fechaLimite).toLocaleString()}
                            </span>
                            <button 
                              className="btn btn-primary btn-sm btn-icon"
                              onClick={() => handleOpenSubmit(act)}
                            >
                              <span>Subir Evidencia</span>
                              <Send size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              myEvidences.length === 0 ? (
                <div className="empty-state">
                  <FileText size={48} color="var(--text-muted)" />
                  <h3>Sin entregas</h3>
                  <p>Aún no has enviado ninguna evidencia a la plataforma.</p>
                </div>
              ) : (
                <div className="evidences-table-view">
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Actividad</th>
                          <th>Fecha Entrega</th>
                          <th>Nota</th>
                          <th>Estado</th>
                          <th>Retroalimentación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myEvidences.map((ev) => {
                          const act = activities.find((a) => a.id === ev.actividadId);
                          return (
                            <tr key={ev.id}>
                              <td>
                                <div className="activity-name-cell">
                                  <strong>{act?.titulo || 'Actividad'}</strong>
                                  {ev.entregaTardia && <span className="tardy-text">Entrega Tardía</span>}
                                </div>
                              </td>
                              <td>{new Date(ev.fechaEntrega).toLocaleString()}</td>
                              <td>
                                <span className={`grade-cell-value ${ev.estado === 'aprobado' ? 'passed' : ev.estado === 'deficiente' ? 'failed' : ''}`}>
                                  {ev.estado === 'pendiente' ? '--' : `${ev.notaFinal}/100`}
                                </span>
                              </td>
                              <td>
                                <Badge status={ev.estado} />
                              </td>
                              <td className="retro-cell">
                                {ev.retroalimentacion ? (
                                  <p className="retro-text" title={ev.retroalimentacion}>{ev.retroalimentacion}</p>
                                ) : (
                                  <span className="text-muted italic">Esperando evaluación...</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {selectedActivity && (
        <div className="modal-overlay">
          <div className="glass-card modal-container">
            <div className="modal-header">
              <h3>Entregar Evidencia</h3>
              <button className="modal-close" onClick={handleCloseSubmit}>
                <X size={20} />
              </button>
            </div>
            
            {submitSuccess ? (
              <div className="submit-success-view">
                <CheckCircle size={54} color="var(--accent-success)" />
                <h4>¡Evidencia enviada con éxito!</h4>
                <p>Tu instructor ha recibido una notificación de tu entrega.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="modal-form">
                <div className="modal-activity-summary">
                  <h4>{selectedActivity.titulo}</h4>
                  <p>{selectedActivity.descripcion}</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Comentarios o Texto de Evidencia</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    required
                    placeholder="Escribe aquí los comentarios sobre tu desarrollo o la respuesta directa a la actividad..."
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Enlace de Soporte (Repositorio GitHub, Drive, etc.)</label>
                  <div className="input-with-icon">
                    <ExternalLink size={16} className="input-icon" />
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://github.com/usuario/repositorio"
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Simular Archivo Adjunto (Nombre del Archivo)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Evidencia_Desarrollo.zip"
                    value={formFile}
                    onChange={(e) => setFormFile(e.target.value)}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseSubmit}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Enviar Evidencia
                    <Send size={16} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .apprentice-dashboard-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .dashboard-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem !important;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%);
        }

        .banner-badge {
          background: rgba(99, 102, 241, 0.15);
          color: var(--accent-primary);
          border: 1px solid rgba(99, 102, 241, 0.3);
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .dashboard-banner h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .course-name-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .completion-ring-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .ring-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .metrics-grid {
          margin-bottom: 0.5rem;
        }

        .tab-header {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1.5rem;
          gap: 1rem;
        }

        .tab-btn {
          padding: 0.75rem 1rem;
          color: var(--text-secondary);
          border-bottom: 2px solid transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all var(--transition-fast);
          font-weight: 500;
          font-size: 0.95rem;
        }

        .tab-btn.active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
        }

        .empty-state {
          text-align: center;
          padding: 3.5rem 2rem;
          color: var(--text-secondary);
        }

        .empty-state h3 {
          margin-top: 1rem;
          color: #fff;
        }

        .activities-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-card {
          padding: 1.25rem !important;
          background: rgba(255, 255, 255, 0.015);
        }

        .activity-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .activity-card-header h4 {
          font-size: 1.1rem;
          color: #fff;
        }

        .activity-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
        }

        .activity-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          border-top: 1px solid var(--border-color);
          padding-top: 0.75rem;
        }

        .competence-badge {
          color: var(--text-muted);
        }

        .meta-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .date-limit {
          color: var(--text-secondary);
        }

        .tardy-text {
          color: var(--accent-danger);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          background: var(--accent-danger-glow);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          display: inline-block;
          margin-left: 0.5rem;
        }

        .grade-cell-value {
          font-weight: 700;
        }

        .grade-cell-value.passed {
          color: var(--accent-success);
        }

        .grade-cell-value.failed {
          color: var(--accent-danger);
        }

        .retro-cell {
          max-width: 280px;
        }

        .retro-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        /* Modal styling */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          z-index: 150;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-container {
          width: 100%;
          max-width: 580px;
          padding: 2rem !important;
          animation: fadeInUp var(--transition-normal) forwards;
          background: rgba(15, 17, 30, 0.95) !important;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
        }

        .modal-close {
          color: var(--text-secondary);
          cursor: pointer;
        }

        .modal-activity-summary {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .modal-activity-summary h4 {
          margin-bottom: 0.25rem;
          color: #fff;
        }

        .modal-activity-summary p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .submit-success-view {
          text-align: center;
          padding: 3rem 1rem;
        }

        .submit-success-view h4 {
          margin-top: 1rem;
          font-size: 1.25rem;
          color: #fff;
        }

        .submit-success-view p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default ApprenticeDashboard;

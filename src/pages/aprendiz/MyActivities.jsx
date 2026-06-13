import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/ui/Badge';
import { BookOpen, Calendar, Send, X, CheckCircle, ExternalLink } from 'lucide-react';

const MyActivities = () => {
  const { currentUser, courses, activities, evidences, submitEvidence } = useApp();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [formText, setFormText] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formFile, setFormFile] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const myCourse = courses.find(c => c.id === currentUser?.cursoId);
  const myActivities = activities.filter(act => act.cursoId === myCourse?.id);
  const myEvidences = evidences.filter(ev => ev.aprendizId === currentUser?.id);

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
        formFile || 'archivo_entrega.zip',
        formLink
      );
      setSubmitSuccess(true);
      setTimeout(() => {
        handleCloseSubmit();
      }, 1500);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="my-activities-wrapper fade-in-up">
      <div className="section-header">
        <h2>Actividades del Programa</h2>
        <p className="text-secondary">Visualiza y entrega los compromisos de tu ficha formativa</p>
      </div>

      <div className="activities-grid">
        {myActivities.length === 0 ? (
          <div className="glass-card empty-state">
            <BookOpen size={48} color="var(--text-muted)" />
            <h3>No hay actividades</h3>
            <p>Tu instructor aún no ha asignado actividades a este curso.</p>
          </div>
        ) : (
          myActivities.map((act) => {
            const ev = myEvidences.find(e => e.actividadId === act.id);
            const isOverdue = new Date() > new Date(act.fechaLimite);
            
            return (
              <div key={act.id} className="glass-card activity-card">
                <div className="activity-header">
                  <span className="competence-tag">Competencia</span>
                  <Badge status={ev ? ev.estado : (isOverdue ? 'deficiente' : 'pendiente')} />
                </div>
                <h3>{act.titulo}</h3>
                <p className="activity-desc">{act.descripcion}</p>
                <div className="activity-rubric-summary">
                  <strong>Criterios de evaluación:</strong>
                  <ul>
                    {act.criteriosRubrica.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div className="activity-footer">
                  <div className="footer-meta">
                    <Calendar size={14} />
                    <span>Límite: {new Date(act.fechaLimite).toLocaleDateString()}</span>
                  </div>
                  {ev ? (
                    <div className="delivery-done-label">
                      <CheckCircle size={16} color="var(--accent-success)" />
                      <span>Entregado</span>
                    </div>
                  ) : (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleOpenSubmit(act)}
                    >
                      <span>Entregar Evidencia</span>
                      <Send size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
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
                <p>Tu entrega fue registrada y está a la espera de calificación.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="modal-form">
                <div className="modal-activity-summary">
                  <h4>{selectedActivity.titulo}</h4>
                  <p>{selectedActivity.descripcion}</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Resumen / Comentarios</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    required
                    placeholder="Escribe detalles de tu entrega..."
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Enlace URL (Repositorio, Proyecto en Nube, etc.)</label>
                  <div className="input-with-icon">
                    <ExternalLink size={16} className="input-icon" />
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://github.com/usuario/mi-evidencia"
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nombre del Archivo Adjunto (Simulado)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="evidencia_comprimida.zip"
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
        .my-activities-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-header {
          margin-bottom: 0.5rem;
        }

        .activities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
        }

        .activity-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .competence-tag {
          font-size: 0.7rem;
          color: var(--accent-primary);
          background: var(--accent-primary-glow);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .activity-card h3 {
          font-size: 1.15rem;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .activity-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          flex: 1;
        }

        .activity-rubric-summary {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 1.25rem;
          font-size: 0.75rem;
        }

        .activity-rubric-summary strong {
          color: var(--text-secondary);
          display: block;
          margin-bottom: 0.25rem;
        }

        .activity-rubric-summary ul {
          padding-left: 1rem;
          color: var(--text-muted);
        }

        .activity-rubric-summary li {
          margin-bottom: 0.15rem;
        }

        .activity-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-color);
          padding-top: 0.75rem;
          font-size: 0.8rem;
        }

        .footer-meta {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-secondary);
        }

        .delivery-done-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--accent-success);
          font-weight: 600;
        }

        /* Modal sharing is mapped under same styles as ApprenticeDashboard */
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

export default MyActivities;

import React from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/ui/Badge';
import { FileText, Calendar, Shield, ArrowRight } from 'lucide-react';

const MyEvidences = () => {
  const { currentUser, evidences, activities } = useApp();

  const myEvidences = evidences.filter(ev => ev.aprendizId === currentUser?.id);

  return (
    <div className="my-evidences-wrapper fade-in-up">
      <div className="section-header">
        <h2>Historial de Entregas</h2>
        <p className="text-secondary">Consulta el estado de revisión y retroalimentaciones de tus evidencias</p>
      </div>

      {myEvidences.length === 0 ? (
        <div className="glass-card empty-state">
          <FileText size={48} color="var(--text-muted)" />
          <h3>No has enviado evidencias</h3>
          <p>Ve a la sección de actividades para realizar tu primera entrega.</p>
        </div>
      ) : (
        <div className="evidences-list">
          {myEvidences.map((ev) => {
            const act = activities.find(a => a.id === ev.actividadId);
            return (
              <div key={ev.id} className="glass-card evidence-item">
                <div className="evidence-item-header">
                  <div>
                    <h3>{act?.titulo || 'Actividad Desconocida'}</h3>
                    <div className="evidence-time-meta">
                      <Calendar size={12} />
                      <span>Entregado el: {new Date(ev.fechaEntrega).toLocaleString()}</span>
                      {ev.entregaTardia && <span className="tardy-badge">Tardía</span>}
                    </div>
                  </div>
                  <div className="header-status-side">
                    <Badge status={ev.estado} />
                  </div>
                </div>

                <div className="evidence-body-content">
                  <div className="content-block text-block">
                    <strong>Tus Comentarios:</strong>
                    <p>{ev.contenidoTexto}</p>
                  </div>

                  {(ev.adjuntoNombre || ev.enlaceExterno) && (
                    <div className="content-block links-block">
                      <strong>Recursos Adjuntos:</strong>
                      <div className="resource-links">
                        {ev.adjuntoNombre && (
                          <span className="file-attachment">
                            📎 {ev.adjuntoNombre}
                          </span>
                        )}
                        {ev.enlaceExterno && (
                          <a href={ev.enlaceExterno} target="_blank" rel="noopener noreferrer" className="external-repository-link">
                            🔗 Ver Repositorio Externo <ArrowRight size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {ev.estado !== 'pendiente' ? (
                    <div className="grading-report-box">
                      <div className="grader-info-row">
                        <Shield size={16} color="var(--accent-primary)" />
                        <span>Evaluado por: <strong>Instructor del Curso</strong> el {new Date(ev.fechaCalificacion).toLocaleDateString()}</span>
                        <span className="final-grade-badge">
                          Puntuación: <strong>{ev.notaFinal}/100</strong>
                        </span>
                      </div>
                      <div className="grader-feedback">
                        <strong>Retroalimentación:</strong>
                        <p>{ev.retroalimentacion}</p>
                      </div>
                      
                      {/* Rubric metrics view */}
                      {ev.calificacionRubrica && Object.keys(ev.calificacionRubrica).length > 0 && (
                        <div className="rubric-metrics-details">
                          <strong>Criterios de Rúbrica:</strong>
                          <div className="rubric-scores-grid">
                            {Object.entries(ev.calificacionRubrica).map(([criterio, score]) => {
                              const scoreLabels = ['Bajo', 'Básico', 'Alto', 'Excelente'];
                              return (
                                <div key={criterio} className="rubric-score-bar-item">
                                  <span className="rubric-criterio-name">{criterio}</span>
                                  <div className="score-fill-indicator">
                                    <div className={`score-bar fill-${score}`}></div>
                                    <span className="score-label-text">{scoreLabels[score - 1]} ({score}/4)</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="waiting-review-box">
                      <span>⏳ Tu evidencia se encuentra en la cola de revisión de tu instructor. Recibirás una notificación cuando sea calificada.</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .my-evidences-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-header {
          margin-bottom: 0.5rem;
        }

        .evidences-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .evidence-item {
          border-left: 4px solid var(--border-color);
        }

        .evidence-item:has(.badge-aprobado) {
          border-left-color: var(--accent-success);
        }

        .evidence-item:has(.badge-deficiente) {
          border-left-color: var(--accent-danger);
        }

        .evidence-item:has(.badge-pendiente) {
          border-left-color: var(--accent-warning);
        }

        .evidence-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        .evidence-item-header h3 {
          font-size: 1.2rem;
          color: #fff;
          margin-bottom: 0.25rem;
        }

        .evidence-time-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .tardy-badge {
          background: var(--accent-danger-glow);
          color: var(--accent-danger);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .evidence-body-content {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .content-block strong {
          display: block;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.35rem;
        }

        .content-block p {
          font-size: 0.9rem;
          color: var(--text-primary);
          background: rgba(0, 0, 0, 0.15);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .resource-links {
          display: flex;
          gap: 1.5rem;
          font-size: 0.85rem;
        }

        .file-attachment {
          color: var(--text-secondary);
        }

        .external-repository-link {
          color: var(--accent-primary);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .external-repository-link:hover {
          text-decoration: underline;
        }

        .grading-report-box {
          background: rgba(99, 102, 241, 0.02);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .grader-info-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          flex-wrap: wrap;
        }

        .final-grade-badge {
          margin-left: auto;
          background: var(--accent-primary-glow);
          color: var(--accent-primary);
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-weight: 600;
        }

        .grader-feedback strong {
          display: block;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .grader-feedback p {
          font-size: 0.9rem;
          color: #fff;
          background: rgba(255,255,255,0.01);
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          border: 1px solid var(--border-color);
        }

        .rubric-metrics-details strong {
          display: block;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .rubric-scores-grid {
          display: grid;
          grid-template-cols: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }

        .rubric-score-bar-item {
          background: rgba(0,0,0,0.1);
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .rubric-criterio-name {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: block;
          margin-bottom: 0.35rem;
        }

        .score-fill-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .score-bar {
          height: 6px;
          border-radius: 3px;
          background: var(--border-color);
          flex: 1;
          position: relative;
        }

        .score-bar::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          border-radius: 3px;
        }

        .score-bar.fill-1::before { width: 25%; background-color: var(--accent-danger); }
        .score-bar.fill-2::before { width: 50%; background-color: var(--accent-warning); }
        .score-bar.fill-3::before { width: 75%; background-color: var(--accent-info); }
        .score-bar.fill-4::before { width: 100%; background-color: var(--accent-success); }

        .score-label-text {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .waiting-review-box {
          background: rgba(245, 158, 11, 0.02);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 10px;
          padding: 1rem;
          font-size: 0.85rem;
          color: var(--accent-warning);
        }
      `}</style>
    </div>
  );
};

export default MyEvidences;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Download, 
  ExternalLink, 
  AlertTriangle, 
  FileText, 
  CheckCircle,
  FileCheck2,
  XCircle
} from 'lucide-react';

const GradeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { evidences, users, activities, courses, gradeEvidence } = useApp();

  const [rubricScores, setRubricScores] = useState({});
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('aprobado'); // 'aprobado' | 'deficiente'
  const [calculatedGrade, setCalculatedGrade] = useState(0);

  // Find evidence details
  const evidence = evidences.find((ev) => ev.id === id);
  const student = users.find((u) => u.id === evidence?.aprendizId);
  const activity = activities.find((a) => a.id === evidence?.actividadId);
  const course = courses.find((c) => c.id === activity?.cursoId);

  // Initial load
  useEffect(() => {
    if (evidence) {
      setFeedback(evidence.retroalimentacion || '');
      setStatus(evidence.estado === 'pendiente' ? 'aprobado' : evidence.estado);
      
      const initialRubric = {};
      if (activity?.criteriosRubrica) {
        activity.criteriosRubrica.forEach((criterio) => {
          initialRubric[criterio] = evidence.calificacionRubrica?.[criterio] || 3; // Default score: 3 (Alto)
        });
      }
      setRubricScores(initialRubric);
    }
  }, [evidence, activity]);

  // Recalculate grade whenever rubric scores change
  useEffect(() => {
    const criteriaKeys = Object.keys(rubricScores);
    if (criteriaKeys.length > 0) {
      const sum = criteriaKeys.reduce((acc, c) => acc + rubricScores[c], 0);
      const maxPossible = criteriaKeys.length * 4;
      const grade = Math.round((sum / maxPossible) * 100);
      setCalculatedGrade(grade);
      
      // Auto-set status recommendations
      if (grade >= 60) {
        setStatus('aprobado');
      } else {
        setStatus('deficiente');
      }
    }
  }, [rubricScores]);

  if (!evidence) {
    return (
      <div className="glass-card error-details-state">
        <h3>Evidencia no encontrada</h3>
        <button className="btn btn-secondary" onClick={() => navigate('/instructor/calificar')}>
          Volver a la cola
        </button>
      </div>
    );
  }

  const handleScoreSelect = (criterio, score) => {
    setRubricScores({
      ...rubricScores,
      [criterio]: score
    });
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    try {
      gradeEvidence(
        evidence.id,
        rubricScores,
        calculatedGrade,
        feedback,
        status
      );
      alert("Calificación guardada y notificada con éxito.");
      navigate('/instructor/calificar');
    } catch (err) {
      alert(err.message || 'Error al guardar la calificación.');
    }
  };

  const fillTemplate = (text) => {
    setFeedback(text);
  };

  const feedbackTemplates = [
    { label: "Excelente", text: "Excelente trabajo. Cumple satisfactoriamente con la totalidad de los criterios establecidos en la rúbrica y demuestra un entendimiento profundo del tema." },
    { label: "Aprobado con Observaciones", text: "Buen desarrollo del ejercicio. Se aprecian las competencias requeridas. No obstante, ten en cuenta las correcciones señaladas para futuros entregables." },
    { label: "Deficiente (Corregir)", text: "El entregable no cumple con los criterios mínimos de la rúbrica. Falta profundizar en la estructura técnica. Debes aplicar las correcciones y volver a subir la evidencia." }
  ];

  return (
    <div className="grade-detail-wrapper fade-in-up">
      {/* Return header */}
      <div className="grade-detail-nav no-print">
        <button className="back-queue-btn" onClick={() => navigate('/instructor/calificar')}>
          <ArrowLeft size={16} />
          Volver a la cola de calificación
        </button>
      </div>

      <div className="detail-split-layout">
        {/* LEFT PANEL: Evidence Display */}
        <div className="evidence-view-panel glass-card">
          <div className="panel-header">
            <h3>Contenido de la Evidencia</h3>
          </div>

          <div className="apprentice-profile-header">
            <img src={student?.avatarUrl} alt={student?.nombre} className="detail-avatar" />
            <div className="profile-details">
              <h4>{student?.nombre}</h4>
              <span className="profile-course">{course?.nombre} (Ficha: {course?.ficha})</span>
              <div className="delivery-time-meta">
                <Calendar size={13} />
                <span>Entregado el: {new Date(evidence.fechaEntrega).toLocaleString()}</span>
                {evidence.entregaTardia && <span className="tardy-badge">Entrega Tardía</span>}
              </div>
            </div>
          </div>

          <div className="evidence-activity-summary-block">
            <strong>Actividad Relacionada:</strong>
            <h4>{activity?.titulo}</h4>
            <p>{activity?.descripcion}</p>
          </div>

          <div className="evidence-written-content">
            <strong>Comentarios del Aprendiz:</strong>
            <p className="written-text">{evidence.contenidoTexto || 'El aprendiz no ingresó comentarios escritos.'}</p>
          </div>

          {/* Resources & Links */}
          {(evidence.adjuntoNombre || evidence.enlaceExterno) && (
            <div className="evidence-attached-resources">
              <strong>Entregables y Enlaces:</strong>
              <div className="resources-grid-links">
                {evidence.adjuntoNombre && (
                  <div className="resource-link-item">
                    <FileText size={18} color="var(--text-secondary)" />
                    <div className="link-item-info">
                      <span>{evidence.adjuntoNombre}</span>
                      <span className="file-size-mock">Archivo adjunto (Zip/Pdf)</span>
                    </div>
                    <button type="button" className="btn btn-secondary btn-icon-only" title="Simular Descarga">
                      <Download size={14} />
                    </button>
                  </div>
                )}

                {evidence.enlaceExterno && (
                  <div className="resource-link-item">
                    <ExternalLink size={18} color="var(--accent-primary)" />
                    <div className="link-item-info">
                      <a href={evidence.enlaceExterno} target="_blank" rel="noopener noreferrer" className="ext-repo-anchor">
                        Repositorio del Proyecto
                      </a>
                      <span className="file-size-mock">Servidor / Código fuente externo</span>
                    </div>
                    <a href={evidence.enlaceExterno} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-icon-only">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Evaluation Form & Rubric */}
        <div className="evaluation-control-panel glass-card">
          <div className="panel-header">
            <h3>Evaluación y Rúbrica</h3>
          </div>

          <form onSubmit={handleGradeSubmit} className="grading-form-container">
            {/* Criteria scoring */}
            <div className="rubric-interactive-list">
              {activity?.criteriosRubrica.map((criterio) => {
                const currentScore = rubricScores[criterio] || 3;
                return (
                  <div key={criterio} className="rubric-criterio-card">
                    <span className="criterio-card-title">{criterio}</span>
                    <div className="rubric-score-options">
                      {[1, 2, 3, 4].map((score) => {
                        const labels = ['Bajo', 'Básico', 'Alto', 'Excelente'];
                        return (
                          <button
                            key={score}
                            type="button"
                            className={`rubric-score-btn select-${score} ${currentScore === score ? 'active' : ''}`}
                            onClick={() => handleScoreSelect(criterio, score)}
                            title={labels[score - 1]}
                          >
                            <span className="number-val">{score}</span>
                            <span className="lbl-val">{labels[score - 1]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations display */}
            <div className="evaluation-grade-indicator-card">
              <div className="grade-score-meta">
                <span>Nota Final Calculada:</span>
                <h2>{calculatedGrade} <span className="max-pct">/ 100</span></h2>
              </div>
              <div className="grade-recommendation">
                <span>Estado Evaluativo Recomendado:</span>
                <div className="status-recommendation-row">
                  <button
                    type="button"
                    className={`status-toggle-btn approve-btn ${status === 'aprobado' ? 'active' : ''}`}
                    onClick={() => setStatus('aprobado')}
                  >
                    <CheckCircle size={16} />
                    <span>Aprobado</span>
                  </button>
                  <button
                    type="button"
                    className={`status-toggle-btn fail-btn ${status === 'deficiente' ? 'active' : ''}`}
                    onClick={() => setStatus('deficiente')}
                  >
                    <AlertTriangle size={16} />
                    <span>Deficiente</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Feedback & templates */}
            <div className="form-group">
              <div className="feedback-label-row">
                <label className="form-label">Retroalimentación para el Aprendiz</label>
                <div className="templates-selector-row">
                  {feedbackTemplates.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      className="template-badge-btn"
                      onClick={() => fillTemplate(t.text)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                className="form-control"
                rows="4"
                required
                placeholder="Escribe la retroalimentación técnica y observaciones..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full save-grading-btn">
              Guardar y Notificar Calificación
              <FileCheck2 size={18} />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .grade-detail-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .grade-detail-nav {
          margin-bottom: 0.5rem;
        }

        .back-queue-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .back-queue-btn:hover {
          color: var(--accent-primary);
        }

        .detail-split-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .detail-split-layout {
            grid-template-columns: 1fr;
          }
        }

        .panel-header {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .panel-header h3 {
          font-size: 1.1rem;
          color: #fff;
        }

        .apprentice-profile-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255,255,255,0.01);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .detail-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }

        .profile-details h4 {
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 0.15rem;
        }

        .profile-course {
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: block;
          margin-bottom: 0.35rem;
        }

        .delivery-time-meta {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .tardy-badge {
          background: var(--accent-danger-glow);
          color: var(--accent-danger);
          padding: 0.05rem 0.35rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 700;
        }

        .evidence-activity-summary-block {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid var(--border-color);
        }

        .evidence-activity-summary-block strong {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: block;
          margin-bottom: 0.25rem;
        }

        .evidence-activity-summary-block h4 {
          font-size: 1rem;
          color: #fff;
          margin-bottom: 0.25rem;
        }

        .evidence-activity-summary-block p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .evidence-written-content {
          margin-bottom: 1.5rem;
        }

        .evidence-written-content strong {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: block;
          margin-bottom: 0.5rem;
        }

        .written-text {
          font-size: 0.9rem;
          background: rgba(0, 0, 0, 0.15);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          line-height: 1.6;
        }

        .evidence-attached-resources strong {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: block;
          margin-bottom: 0.5rem;
        }

        .resources-grid-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .resource-link-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          padding: 0.75rem 1rem;
          border-radius: 10px;
        }

        .link-item-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .link-item-info span {
          font-size: 0.85rem;
          color: var(--text-primary);
        }

        .ext-repo-anchor {
          font-size: 0.85rem;
          color: var(--accent-primary);
          font-weight: 600;
        }

        .ext-repo-anchor:hover {
          text-decoration: underline;
        }

        .file-size-mock {
          font-size: 0.7rem !important;
          color: var(--text-muted) !important;
        }

        .btn-icon-only {
          padding: 0.5rem;
          border-radius: 8px;
        }

        /* Rubric display */
        .rubric-interactive-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .rubric-criterio-card {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .criterio-card-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .rubric-score-options {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }

        .rubric-score-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .rubric-score-btn .number-val {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .rubric-score-btn .lbl-val {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .rubric-score-btn.active {
          color: #fff;
          font-weight: 600;
        }

        .rubric-score-btn.select-1.active { background: rgba(239, 68, 68, 0.15); border-color: var(--accent-danger); }
        .rubric-score-btn.select-1.active .number-val { color: var(--accent-danger); }
        .rubric-score-btn.select-2.active { background: rgba(245, 158, 11, 0.15); border-color: var(--accent-warning); }
        .rubric-score-btn.select-2.active .number-val { color: var(--accent-warning); }
        .rubric-score-btn.select-3.active { background: rgba(14, 165, 233, 0.15); border-color: var(--accent-info); }
        .rubric-score-btn.select-3.active .number-val { color: var(--accent-info); }
        .rubric-score-btn.select-4.active { background: rgba(16, 185, 129, 0.15); border-color: var(--accent-success); }
        .rubric-score-btn.select-4.active .number-val { color: var(--accent-success); }

        .rubric-score-btn:hover:not(.active) {
          background: rgba(255,255,255,0.02);
        }

        .evaluation-grade-indicator-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .grade-score-meta span {
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: block;
        }

        .grade-score-meta h2 {
          font-size: 2.25rem;
          font-weight: 800;
          color: #fff;
        }

        .max-pct {
          font-size: 1rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .grade-recommendation span {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: block;
          margin-bottom: 0.5rem;
          text-align: right;
        }

        .status-recommendation-row {
          display: flex;
          gap: 0.5rem;
        }

        .status-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: rgba(0,0,0,0.2);
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .status-toggle-btn.approve-btn.active {
          background: var(--accent-success-glow);
          border-color: var(--accent-success);
          color: var(--accent-success);
        }

        .status-toggle-btn.fail-btn.active {
          background: var(--accent-danger-glow);
          border-color: var(--accent-danger);
          color: var(--accent-danger);
        }

        .feedback-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .feedback-label-row label {
          margin-bottom: 0 !important;
        }

        .templates-selector-row {
          display: flex;
          gap: 0.35rem;
        }

        .template-badge-btn {
          font-size: 0.65rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-color);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .template-badge-btn:hover {
          background: var(--accent-primary-glow);
          border-color: var(--accent-primary);
          color: var(--text-primary);
        }

        .save-grading-btn {
          margin-top: 0.5rem;
        }

        .error-details-state {
          text-align: center;
          padding: 4rem;
        }
      `}</style>
    </div>
  );
};

export default GradeDetail;

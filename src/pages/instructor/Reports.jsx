import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/ui/Badge';
import { Download, Printer, Filter, BarChart3, GraduationCap } from 'lucide-react';

const Reports = () => {
  const { currentUser, courses, users, activities, evidences } = useApp();
  const [selectedCourse, setSelectedCourse] = useState('todos');
  const [selectedStatus, setSelectedStatus] = useState('todos');

  // Filter instructor courses
  const myCourses = courses.filter(c => c.instructorId === currentUser?.id);
  const myCourseIds = myCourses.map(c => c.id);

  // Filter activities and their evidences
  const myActivities = activities.filter(act => myCourseIds.includes(act.cursoId));
  const myActivityIds = myActivities.map(act => act.id);
  const myEvidences = evidences.filter(ev => myActivityIds.includes(ev.actividadId));

  // Handle report filter calculations
  const filteredEvidences = myEvidences.filter((ev) => {
    const act = activities.find(a => a.id === ev.actividadId);
    
    // 1. Course filter
    const matchesCourse = selectedCourse === 'todos' || act?.cursoId === selectedCourse;

    // 2. Status filter
    const matchesStatus = selectedStatus === 'todos' || ev.estado === selectedStatus;

    return matchesCourse && matchesStatus;
  });

  // Calculate report metrics
  const totalCount = filteredEvidences.length;
  const approvedCount = filteredEvidences.filter(ev => ev.estado === 'aprobado').length;
  const deficientCount = filteredEvidences.filter(ev => ev.estado === 'deficiente').length;
  const pendingCount = filteredEvidences.filter(ev => ev.estado === 'pendiente').length;

  const gradedEvidences = filteredEvidences.filter(ev => ev.estado !== 'pendiente');
  const reportAverage = gradedEvidences.length > 0
    ? Math.round(gradedEvidences.reduce((acc, curr) => acc + curr.notaFinal, 0) / gradedEvidences.length)
    : 0;

  // CSV Exporter
  const handleExportCSV = () => {
    if (filteredEvidences.length === 0) {
      alert("No hay registros en el reporte para exportar.");
      return;
    }

    const headers = ["ID Evidencia", "Aprendiz", "Curso/Ficha", "Actividad", "Fecha Entrega", "Estado", "Nota Final", "Retroalimentacion"];
    const rows = filteredEvidences.map((ev) => {
      const student = users.find(u => u.id === ev.aprendizId);
      const act = activities.find(a => a.id === ev.actividadId);
      const course = courses.find(c => c.id === act?.cursoId);

      return [
        ev.id,
        student?.nombre || '',
        `${course?.nombre || ''} (${course?.ficha || ''})`,
        `"${act?.titulo || ''}"`,
        ev.fechaEntrega,
        ev.estado,
        ev.estado === 'pendiente' ? '--' : ev.notaFinal,
        `"${ev.retroalimentacion || ''}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_evidencias_sena_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="reports-center-wrapper fade-in-up">
      {/* Page Header */}
      <div className="section-header no-print">
        <h2>Generador de Reportes</h2>
        <p className="text-secondary">Exporta planillas de notas de tus fichas y filtra los promedios académicos</p>
      </div>

      {/* Filter and settings block */}
      <div className="glass-card filters-panel no-print">
        <div className="filters-left">
          <div className="filter-group-item">
            <GraduationCap size={16} className="filter-icon" />
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
            <Filter size={16} className="filter-icon" />
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

        <div className="filters-right-actions">
          <button className="btn btn-secondary btn-sm" onClick={handlePrintPDF}>
            <Printer size={16} />
            Imprimir Reporte (PDF)
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>
            <Download size={16} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Report statistics overview */}
      <div className="report-summary-metrics-row">
        <div className="glass-card stat-summary-box">
          <span className="summary-title">Total Entregas</span>
          <h3>{totalCount}</h3>
        </div>
        <div className="glass-card stat-summary-box approve">
          <span className="summary-title">Aprobados</span>
          <h3>{approvedCount}</h3>
        </div>
        <div className="glass-card stat-summary-box fail">
          <span className="summary-title">Deficientes</span>
          <h3>{deficientCount}</h3>
        </div>
        <div className="glass-card stat-summary-box pending">
          <span className="summary-title">Pendientes</span>
          <h3>{pendingCount}</h3>
        </div>
        <div className="glass-card stat-summary-box avg">
          <span className="summary-title">Promedio de Notas</span>
          <h3>{reportAverage}/100</h3>
        </div>
      </div>

      {/* Printable Report View */}
      <div className="printable-report-sheet glass-card">
        {/* Header visible only on print or clean page */}
        <div className="report-print-header">
          <div className="print-brand-sena">
            <h2>SERVICIO NACIONAL DE APRENDIZAJE — SENA</h2>
            <span>Plataforma de Calificación de Evidencias</span>
          </div>
          <div className="print-meta-fields">
            <div><strong>Instructor:</strong> {currentUser?.nombre}</div>
            <div><strong>Fecha Emisión:</strong> {new Date().toLocaleDateString()}</div>
            <div><strong>Ficha Seleccionada:</strong> {selectedCourse === 'todos' ? 'Todas' : courses.find(c=>c.id===selectedCourse)?.nombre}</div>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Aprendiz</th>
                <th>Curso/Ficha</th>
                <th>Actividad</th>
                <th>Fecha de Entrega</th>
                <th>Calificación</th>
                <th>Estado</th>
                <th className="no-print">Comentario</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvidences.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center italic text-muted">No se registran evidencias con los filtros indicados.</td>
                </tr>
              ) : (
                filteredEvidences.map((ev) => {
                  const student = users.find(u => u.id === ev.aprendizId);
                  const act = activities.find(a => a.id === ev.actividadId);
                  const course = courses.find(c => c.id === act?.cursoId);

                  return (
                    <tr key={ev.id}>
                      <td>
                        <strong>{student?.nombre}</strong>
                        <span className="print-only-email">{student?.email}</span>
                      </td>
                      <td>
                        <span>{course?.nombre}</span>
                        <span className="print-ficha">({course?.ficha})</span>
                      </td>
                      <td>{act?.titulo}</td>
                      <td>{new Date(ev.fechaEntrega).toLocaleDateString()}</td>
                      <td>
                        <span className="grade-score-lbl">
                          {ev.estado === 'pendiente' ? '--' : ev.notaFinal}
                        </span>
                      </td>
                      <td>
                        <Badge status={ev.estado} />
                      </td>
                      <td className="no-print feedback-preview-cell">
                        <span className="feedback-preview-text" title={ev.retroalimentacion}>
                          {ev.retroalimentacion || '--'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .reports-center-wrapper {
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
          padding: 1.25rem !important;
          gap: 1.5rem;
        }

        .filters-left {
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

        .filter-icon {
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

        .filters-right-actions {
          display: flex;
          gap: 0.75rem;
        }

        .report-summary-metrics-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }

        @media (max-width: 1024px) {
          .report-summary-metrics-row {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 640px) {
          .report-summary-metrics-row {
            grid-template-columns: 1fr;
          }
        }

        .stat-summary-box {
          padding: 1rem !important;
          text-align: center;
        }

        .summary-title {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: block;
          margin-bottom: 0.35rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .stat-summary-box h3 {
          font-size: 1.75rem;
          color: #fff;
        }

        .stat-summary-box.approve { border-bottom: 3px solid var(--accent-success); }
        .stat-summary-box.fail { border-bottom: 3px solid var(--accent-danger); }
        .stat-summary-box.pending { border-bottom: 3px solid var(--accent-warning); }
        .stat-summary-box.avg { border-bottom: 3px solid var(--accent-info); }

        .report-print-header {
          display: none;
        }

        .feedback-preview-cell {
          max-width: 200px;
        }

        .feedback-preview-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .print-only-email, .print-ficha {
          display: none;
        }

        .grade-score-lbl {
          font-weight: 600;
        }

        /* Print Override styles */
        @media print {
          .report-print-header {
            display: block;
            margin-bottom: 2rem;
            border-bottom: 2px solid #333;
            padding-bottom: 1rem;
          }

          .print-brand-sena h2 {
            font-size: 1.5rem;
            margin: 0;
            color: #000 !important;
          }

          .print-meta-fields {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            font-size: 0.85rem;
            margin-top: 1rem;
          }

          .print-only-email {
            display: block;
            font-size: 0.75rem;
            color: #666;
          }

          .print-ficha {
            display: inline;
            font-size: 0.8rem;
            color: #555;
            margin-left: 0.25rem;
          }

          .printable-report-sheet {
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }

        @media (max-width: 768px) {
          .filters-panel {
            flex-direction: column;
            align-items: stretch;
          }
          .filters-left, .filters-right-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Reports;

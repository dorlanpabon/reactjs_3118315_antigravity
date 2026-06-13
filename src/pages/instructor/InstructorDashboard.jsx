import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import KPICard from '../../components/ui/KPICard';
import BarChart from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';
import { 
  Users, 
  Clock, 
  Award, 
  BarChart3, 
  FileCheck, 
  AlertTriangle 
} from 'lucide-react';

const InstructorDashboard = () => {
  const { currentUser, courses, users, activities, evidences } = useApp();
  const navigate = useNavigate();

  // Get active courses for this instructor
  const myCourses = courses.filter((c) => c.instructorId === currentUser?.id);
  const myCourseIds = myCourses.map((c) => c.id);

  // Get apprentices enrolled in these courses
  const myApprentices = users.filter((u) => u.rol === 'aprendiz' && myCourseIds.includes(u.cursoId));

  // Get activities for these courses
  const myActivities = activities.filter((act) => myCourseIds.includes(act.cursoId));
  const myActivityIds = myActivities.map((act) => act.id);

  // Get evidences submitted for these activities
  const myEvidences = evidences.filter((ev) => myActivityIds.includes(ev.actividadId));

  // 1. KPI Calculations
  const pendingEvidences = myEvidences.filter((ev) => ev.estado === 'pendiente');
  const gradedEvidences = myEvidences.filter((ev) => ev.estado !== 'pendiente');
  
  const approvalRate = gradedEvidences.length > 0
    ? Math.round((gradedEvidences.filter((ev) => ev.estado === 'aprobado').length / gradedEvidences.length) * 100)
    : 0;

  const averageGrade = gradedEvidences.length > 0
    ? Math.round(gradedEvidences.reduce((acc, curr) => acc + curr.notaFinal, 0) / gradedEvidences.length)
    : 0;

  // 2. Bar Chart Data (Average grade per course)
  const barChartData = myCourses.map((c) => {
    const courseApprenticeIds = users.filter((u) => u.cursoId === c.id).map(u => u.id);
    const courseEvidences = gradedEvidences.filter((ev) => courseApprenticeIds.includes(ev.aprendizId));
    const avg = courseEvidences.length > 0
      ? courseEvidences.reduce((acc, curr) => acc + curr.notaFinal, 0) / courseEvidences.length
      : 0;

    return {
      label: c.nombre.length > 18 ? c.nombre.slice(0, 15) + '...' : c.nombre,
      value: avg
    };
  });

  // 3. Donut Chart Data (Status distribution)
  const approvedCount = myEvidences.filter(ev => ev.estado === 'aprobado').length;
  const deficientCount = myEvidences.filter(ev => ev.estado === 'deficiente').length;
  const pendingCount = pendingEvidences.length;

  const donutChartData = [
    { label: 'Aprobados', value: approvedCount, color: 'var(--accent-success)' },
    { label: 'Deficientes', value: deficientCount, color: 'var(--accent-danger)' },
    { label: 'Pendientes', value: pendingCount, color: 'var(--accent-warning)' }
  ];

  // 4. Urgent queue (oldest pending)
  const urgentQueue = [...pendingEvidences]
    .sort((a, b) => new Date(a.fechaEntrega) - new Date(b.fechaEntrega))
    .slice(0, 5);

  return (
    <div className="instructor-dashboard-wrapper fade-in-up">
      <div className="dashboard-header-intro">
        <h2>Panel del Instructor</h2>
        <p className="text-secondary">Monitoreo de fichas, rendimiento de aprendices y cola de calificación</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-cols-4 metrics-grid">
        <KPICard
          title="Total Aprendices"
          value={myApprentices.length}
          icon={<Users size={22} />}
          description="Matriculados en tus cursos"
          color="indigo"
        />
        <KPICard
          title="Pendientes por Calificar"
          value={pendingEvidences.length}
          icon={<Clock size={22} />}
          description="Revisiones acumuladas"
          color="amber"
          trend={pendingEvidences.length > 0 ? `${pendingEvidences.length} urgentes` : null}
          trendType={pendingEvidences.length > 0 ? 'negative' : 'neutral'}
        />
        <KPICard
          title="Tasa de Aprobación"
          value={`${approvalRate}%`}
          icon={<Award size={22} />}
          description="De evidencias revisadas"
          color="emerald"
        />
        <KPICard
          title="Promedio General"
          value={`${averageGrade}/100`}
          icon={<BarChart3 size={22} />}
          description="Nota promedio global"
          color="sky"
        />
      </div>

      {/* Charts section */}
      <div className="grid-cols-2 charts-grid-section">
        <div className="glass-card chart-card-box">
          <div className="chart-header">
            <h3>Rendimiento Promedio por Ficha</h3>
            <p>Promedio ponderado de calificaciones (0 - 100)</p>
          </div>
          <div className="chart-wrapper-body">
            {barChartData.length > 0 ? (
              <BarChart data={barChartData} />
            ) : (
              <div className="chart-empty">No hay calificaciones suficientes</div>
            )}
          </div>
        </div>

        <div className="glass-card chart-card-box">
          <div className="chart-header">
            <h3>Distribución de Evidencias</h3>
            <p>Estados de entregas en todos tus cursos</p>
          </div>
          <div className="chart-wrapper-body">
            <DonutChart data={donutChartData} />
          </div>
        </div>
      </div>

      {/* Urgent queue */}
      <div className="dashboard-urgent-queue glass-card">
        <div className="queue-header">
          <div className="title-left">
            <AlertTriangle size={18} color="var(--accent-warning)" />
            <h3>Cola de Calificación Urgente</h3>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/instructor/calificar')}
          >
            Ver toda la cola
          </button>
        </div>

        {urgentQueue.length === 0 ? (
          <div className="queue-empty-state">
            <FileCheck size={40} color="var(--accent-success)" />
            <h4>¡Al día!</h4>
            <p>No tienes evidencias pendientes de calificación.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Aprendiz</th>
                  <th>Curso</th>
                  <th>Evidencia / Actividad</th>
                  <th>Fecha de Entrega</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {urgentQueue.map((ev) => {
                  const student = users.find((u) => u.id === ev.aprendizId);
                  const act = activities.find((a) => a.id === ev.actividadId);
                  const course = courses.find((c) => c.id === act?.cursoId);
                  
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
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate(`/instructor/calificar/${ev.id}`)}
                        >
                          Calificar
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
        .instructor-dashboard-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .dashboard-header-intro {
          margin-bottom: 0.5rem;
        }

        .metrics-grid {
          margin-bottom: 0.5rem;
        }

        .chart-card-box {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .chart-header {
          margin-bottom: 1.5rem;
        }

        .chart-header h3 {
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 0.25rem;
        }

        .chart-header p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .chart-wrapper-body {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        .chart-empty {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-style: italic;
        }

        .queue-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .title-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .title-left h3 {
          font-size: 1.1rem;
          color: #fff;
        }

        .queue-empty-state {
          text-align: center;
          padding: 2.5rem 1.5rem;
          color: var(--text-secondary);
        }

        .queue-empty-state h4 {
          margin-top: 0.75rem;
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
      `}</style>
    </div>
  );
};

export default InstructorDashboard;

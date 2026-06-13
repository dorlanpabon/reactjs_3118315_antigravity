import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import PrivateRoute from './router/PrivateRoute';
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Apprentice Pages
import ApprenticeDashboard from './pages/aprendiz/ApprenticeDashboard';
import MyActivities from './pages/aprendiz/MyActivities';
import MyEvidences from './pages/aprendiz/MyEvidences';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import GradeQueue from './pages/instructor/GradeQueue';
import GradeDetail from './pages/instructor/GradeDetail';
import Reports from './pages/instructor/Reports';

// Home Redirect component
const HomeRedirect = () => {
  const { currentUser } = useApp();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={currentUser.rol === 'instructor' ? '/instructor/dashboard' : '/aprendiz/dashboard'} replace />;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root Redirect */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Apprentice Protected Routes */}
          <Route
            path="/aprendiz/*"
            element={
              <PrivateRoute allowedRole="aprendiz">
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<ApprenticeDashboard />} />
                    <Route path="actividades" element={<MyActivities />} />
                    <Route path="evidencias" element={<MyEvidences />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Instructor Protected Routes */}
          <Route
            path="/instructor/*"
            element={
              <PrivateRoute allowedRole="instructor">
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<InstructorDashboard />} />
                    <Route path="calificar" element={<GradeQueue />} />
                    <Route path="calificar/:id" element={<GradeDetail />} />
                    <Route path="reportes" element={<Reports />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Fallback Catch-All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockDb } from '../data/mockDb';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [evidences, setEvidences] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Sync state with LocalStorage on mount
  useEffect(() => {
    setCurrentUser(mockDb.getSession());
    setCourses(mockDb.getCursos());
    setUsers(mockDb.getUsuarios());
    setActivities(mockDb.getActividades());
    setEvidences(mockDb.getEvidencias());
    setNotifications(mockDb.getNotificaciones());
  }, []);

  // Helper helper to update state & localStorage together
  const updateCoursesState = (newCourses) => {
    setCourses(newCourses);
    mockDb.saveCursos(newCourses);
  };

  const updateUsersState = (newUsers) => {
    setUsers(newUsers);
    mockDb.saveUsuarios(newUsers);
  };

  const updateActivitiesState = (newActivities) => {
    setActivities(newActivities);
    mockDb.saveActividades(newActivities);
  };

  const updateEvidencesState = (newEvidences) => {
    setEvidences(newEvidences);
    mockDb.saveEvidencias(newEvidences);
  };

  const updateNotificationsState = (newNotifs) => {
    setNotifications(newNotifs);
    mockDb.saveNotificaciones(newNotifs);
  };

  // Auth Operations
  const login = (email, password) => {
    const allUsers = mockDb.getUsuarios();
    const user = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      throw new Error("Credenciales inválidas.");
    }
    mockDb.setSession(user);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    mockDb.clearSession();
    setCurrentUser(null);
  };

  const register = (nombre, email, password, rol, cursoId = "", especialidad = "") => {
    const allUsers = mockDb.getUsuarios();
    if (allUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("El correo ya se encuentra registrado.");
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      nombre,
      email,
      password,
      rol,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${nombre.replace(/\s+/g, '')}`,
      createdAt: new Date().toISOString()
    };

    if (rol === 'aprendiz') {
      newUser.cursoId = cursoId;
    } else {
      newUser.especialidad = especialidad;
    }

    const updatedUsers = [...allUsers, newUser];
    updateUsersState(updatedUsers);
    
    // Auto login after registration
    mockDb.setSession(newUser);
    setCurrentUser(newUser);
    return newUser;
  };

  // Evidence Operations
  const submitEvidence = (actividadId, contenidoTexto, adjuntoNombre, enlaceExterno) => {
    if (!currentUser) throw new Error("Debe iniciar sesión.");
    
    const activity = activities.find(a => a.id === actividadId);
    if (!activity) throw new Error("Actividad no encontrada.");

    const allEvidences = mockDb.getEvidencias();

    // Check if evidence already submitted for this activity by this apprentice
    const existingIndex = allEvidences.findIndex(
      (ev) => ev.actividadId === actividadId && ev.aprendizId === currentUser.id
    );

    const isTardy = new Date() > new Date(activity.fechaLimite);

    const newEvidence = {
      id: existingIndex >= 0 ? allEvidences[existingIndex].id : `ev-${Date.now()}`,
      actividadId,
      aprendizId: currentUser.id,
      contenidoTexto,
      adjuntoNombre,
      adjuntoBase64: "", // Mocked base64
      enlaceExterno,
      estado: "pendiente",
      calificacionRubrica: {},
      notaFinal: 0,
      retroalimentacion: "",
      instructorId: "",
      fechaEntrega: new Date().toISOString(),
      fechaCalificacion: "",
      entregaTardia: isTardy
    };

    let updatedEvidences;
    if (existingIndex >= 0) {
      updatedEvidences = [...allEvidences];
      updatedEvidences[existingIndex] = newEvidence;
    } else {
      updatedEvidences = [...allEvidences, newEvidence];
    }

    updateEvidencesState(updatedEvidences);

    // Notify instructor assigned to the course
    const course = courses.find((c) => c.id === activity.cursoId);
    if (course && course.instructorId) {
      addNotification(
        course.instructorId,
        `${currentUser.nombre} ha entregado la evidencia para '${activity.titulo}'.`,
        "entrega"
      );
    }

    return newEvidence;
  };

  const gradeEvidence = (evidenciaId, calificacionRubrica, notaFinal, retroalimentacion, estado) => {
    if (!currentUser || currentUser.rol !== 'instructor') {
      throw new Error("Permisos insuficientes.");
    }

    const allEvidences = mockDb.getEvidencias();
    const index = allEvidences.findIndex((ev) => ev.id === evidenciaId);
    if (index === -1) throw new Error("Evidencia no encontrada.");

    const updatedEvidences = [...allEvidences];
    updatedEvidences[index] = {
      ...updatedEvidences[index],
      estado,
      calificacionRubrica,
      notaFinal,
      retroalimentacion,
      instructorId: currentUser.id,
      fechaCalificacion: new Date().toISOString()
    };

    updateEvidencesState(updatedEvidences);

    // Notify apprentice
    const activity = activities.find(a => a.id === updatedEvidences[index].actividadId);
    const activityTitle = activity ? activity.titulo : "Actividad";
    const statusText = estado === 'aprobado' ? 'Aprobado' : 'Deficiente';

    addNotification(
      updatedEvidences[index].aprendizId,
      `Tu evidencia para '${activityTitle}' ha sido calificada como ${statusText} (${notaFinal}/100).`,
      "calificacion"
    );
  };

  // Notification Operations
  const addNotification = (usuarioId, mensaje, tipo) => {
    const allNotifs = mockDb.getNotificaciones();
    const newNotif = {
      id: `not-${Date.now()}`,
      usuarioId,
      mensaje,
      leida: false,
      tipo,
      createdAt: new Date().toISOString()
    };
    updateNotificationsState([newNotif, ...allNotifs]);
  };

  const markNotificationRead = (notificationId) => {
    const allNotifs = mockDb.getNotificaciones();
    const updated = allNotifs.map((n) => 
      n.id === notificationId ? { ...n, leida: true } : n
    );
    updateNotificationsState(updated);
  };

  const resetDatabase = () => {
    mockDb.resetDb();
    setCurrentUser(null);
    setCourses(mockDb.getCursos());
    setUsers(mockDb.getUsuarios());
    setActivities(mockDb.getActividades());
    setEvidences(mockDb.getEvidencias());
    setNotifications(mockDb.getNotificaciones());
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        courses,
        users,
        activities,
        evidences,
        notifications,
        login,
        logout,
        register,
        submitEvidence,
        gradeEvidence,
        addNotification,
        markNotificationRead,
        resetDatabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;

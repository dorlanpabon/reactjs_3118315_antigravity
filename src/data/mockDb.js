import { seedData } from './seedData';

const KEYS = {
  CURSOS: 'sena_cursos',
  USUARIOS: 'sena_usuarios',
  ACTIVIDADES: 'sena_actividades',
  EVIDENCIAS: 'sena_evidencias',
  NOTIFICACIONES: 'sena_notificaciones',
  SESSION: 'sena_session'
};

export const initDb = () => {
  if (!localStorage.getItem(KEYS.CURSOS)) {
    localStorage.setItem(KEYS.CURSOS, JSON.stringify(seedData.cursos));
  }
  if (!localStorage.getItem(KEYS.USUARIOS)) {
    localStorage.setItem(KEYS.USUARIOS, JSON.stringify(seedData.usuarios));
  }
  if (!localStorage.getItem(KEYS.ACTIVIDADES)) {
    localStorage.setItem(KEYS.ACTIVIDADES, JSON.stringify(seedData.actividades));
  }
  if (!localStorage.getItem(KEYS.EVIDENCIAS)) {
    localStorage.setItem(KEYS.EVIDENCIAS, JSON.stringify(seedData.evidencias));
  }
  if (!localStorage.getItem(KEYS.NOTIFICACIONES)) {
    localStorage.setItem(KEYS.NOTIFICACIONES, JSON.stringify(seedData.notificaciones));
  }
};

// Initial trigger
initDb();

export const mockDb = {
  // Cursos
  getCursos: () => JSON.parse(localStorage.getItem(KEYS.CURSOS) || '[]'),
  saveCursos: (data) => localStorage.setItem(KEYS.CURSOS, JSON.stringify(data)),
  
  // Usuarios
  getUsuarios: () => JSON.parse(localStorage.getItem(KEYS.USUARIOS) || '[]'),
  saveUsuarios: (data) => localStorage.setItem(KEYS.USUARIOS, JSON.stringify(data)),
  
  // Actividades
  getActividades: () => JSON.parse(localStorage.getItem(KEYS.ACTIVIDADES) || '[]'),
  saveActividades: (data) => localStorage.setItem(KEYS.ACTIVIDADES, JSON.stringify(data)),
  
  // Evidencias
  getEvidencias: () => JSON.parse(localStorage.getItem(KEYS.EVIDENCIAS) || '[]'),
  saveEvidencias: (data) => localStorage.setItem(KEYS.EVIDENCIAS, JSON.stringify(data)),
  
  // Notificaciones
  getNotificaciones: () => JSON.parse(localStorage.getItem(KEYS.NOTIFICACIONES) || '[]'),
  saveNotificaciones: (data) => localStorage.setItem(KEYS.NOTIFICACIONES, JSON.stringify(data)),
  
  // Session
  getSession: () => JSON.parse(localStorage.getItem(KEYS.SESSION) || 'null'),
  setSession: (user) => localStorage.setItem(KEYS.SESSION, JSON.stringify(user)),
  clearSession: () => localStorage.removeItem(KEYS.SESSION),
  
  // Helper to reset database to default seed values
  resetDb: () => {
    localStorage.removeItem(KEYS.CURSOS);
    localStorage.removeItem(KEYS.USUARIOS);
    localStorage.removeItem(KEYS.ACTIVIDADES);
    localStorage.removeItem(KEYS.EVIDENCIAS);
    localStorage.removeItem(KEYS.NOTIFICACIONES);
    localStorage.removeItem(KEYS.SESSION);
    initDb();
  }
};

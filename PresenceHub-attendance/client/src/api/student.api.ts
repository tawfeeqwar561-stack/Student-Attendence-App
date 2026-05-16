import api from './axios';

export const studentApi = {
  getDashboard: () => api.get('/students/dashboard'),
  getAttendance: () => api.get('/students/attendance'),
  getMarks: () => api.get('/students/marks'),
  getFees: () => api.get('/students/fees'),
  getResults: () => api.get('/students/results'),
  getDiscipline: () => api.get('/students/discipline')
};

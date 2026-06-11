import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  registerUser: (data) => api.post('/auth/register/user', data),
  registerPhysio: (data) => api.post('/auth/register/physiotherapist', data),
  login: (data) => api.post('/auth/login', data),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
};

// User
export const userApi = {
  getPhysiotherapists: () => api.get('/physiotherapists'),
  getPhysiotherapist: (id) => api.get(`/physiotherapists/${id}`),
  getAvailableSlots: (physioId, date) =>
    api.get(`/physiotherapists/${physioId}/slots?date=${date}`),
  bookAppointment: (data) => api.post('/user/appointments/book', data),
  getMyAppointments: () => api.get('/user/appointments'),
};

// Physiotherapist
export const physioApi = {
  getTodayAppointments: () => api.get('/physio/appointments/today'),
  getAppointmentsByDate: (date) => api.get(`/physio/appointments?date=${date}`),
  getSlots: (date) => api.get(`/physio/slots?date=${date}`),
  createSlots: (data) => api.post('/physio/slots', data),
  blockSlot: (slotId) => api.put(`/physio/slots/${slotId}/block`),
  unblockSlot: (slotId) => api.put(`/physio/slots/${slotId}/unblock`),
  reorderAppointments: (data) => api.put('/physio/appointments/reorder', data),
};

export default api;
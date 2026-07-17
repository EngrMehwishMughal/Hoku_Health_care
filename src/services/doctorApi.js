import api from './api';

export const getDashboardData = () => api.get('/doctors/dashboard');
export const getAppointments = () => api.get('/doctors/appointments');
export const updateAppointment = (id, payload) => api.put(`/doctors/appointments/${id}`, payload);
export const getPatients = () => api.get('/doctors/patients');
export const getPatientById = (id) => api.get(`/doctors/patients/${id}`);
export const updateAvailability = (payload) => api.put('/doctors/availability', payload);
export const getProfile = () => api.get('/doctors/profile');
export const updateProfile = (payload) => api.put('/doctors/profile', payload);

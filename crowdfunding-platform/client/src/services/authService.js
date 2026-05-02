import api from './api';

export const loginUser = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const registerUser = async (name, email, password, role) => {
  const { data } = await api.post('/auth/register', { name, email, password, role });
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('userInfo');
};

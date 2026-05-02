import api from './api';

export const getProjects = async () => {
  const { data } = await api.get('/projects');
  return data;
};

export const getProjectDetails = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

export const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

export const getProjectInvestors = async (id) => {
  const response = await api.get(`/projects/${id}/investors`);
  return response.data;
};

export const addProjectProfit = async (id, amount) => {
  const response = await api.post(`/projects/${id}/add-profit`, { amount });
  return response.data;
};

export const getMyProjects = async () => {
  const { data } = await api.get('/projects/user/myprojects');
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};

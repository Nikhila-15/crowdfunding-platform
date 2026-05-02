import api from './api';

export const createContributionOrder = async (amount, projectId) => {
  const { data } = await api.post('/contributions/order', { amount, projectId });
  return data;
};

export const verifyContributionPayment = async (paymentData) => {
  const { data } = await api.post('/contributions/verify', paymentData);
  return data;
};

export const getMyContributions = async () => {
  const { data } = await api.get('/contributions/mycontributions');
  return data;
};

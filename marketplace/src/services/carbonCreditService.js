import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const getActiveCarbonCredits = async () => {
  const { data } = await axios.get(`${API}/carbon-credits/active`);
  return Array.isArray(data) ? data : [];
};

export const getCarbonCreditById = async (id) => {
  const { data } = await axios.get(`${API}/carbon-credits/${id}`);
  return data;
};

export default {
  getActiveCarbonCredits,
  getCarbonCreditById,
};

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://financetracker-t0ag.onrender.com/api',  // Adjust the base URL to match your backend URL
});

export default api;

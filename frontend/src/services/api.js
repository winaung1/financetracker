import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',  // Adjust the base URL to match your backend URL
});


// const api = axios.create({
//   baseURL: 'https://financetracker-zn8j.onrender.com/api',  // Adjust the base URL to match your backend URL
// });


export default api;

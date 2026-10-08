import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5005/api',withCredentials:true,headers:{'Content-Type':'application/json'},timeout:10000});
api.interceptors.request.use(config=>{const token=localStorage.getItem('token');if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
api.interceptors.response.use(r=>r,e=>{if(e.response?.status===401&&!['/login','/register'].includes(window.location.pathname)){localStorage.removeItem('token');localStorage.removeItem('user');}return Promise.reject(e);});
export default api;

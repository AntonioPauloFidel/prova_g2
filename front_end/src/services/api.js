<<<<<<< HEAD
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
=======
import axios from 'axios';

const api = axios.create({
  // Defina a porta exata onde o backend da sua dupla está rodando (geralmente 3000 ou 5000)
  baseURL: 'http://localhost:3000/api', 
  withCredentials: true, // OBRIGATÓRIO: Permite o envio automático dos cookies de sessão
});

export default api;
>>>>>>> d04a92da61e7e3d898d6dd114bbe615802611261

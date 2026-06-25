import axios from 'axios';

const api = axios.create({
  // Defina a porta exata onde o backend da sua dupla está rodando (geralmente 3000 ou 5000)
  baseURL: 'http://localhost:3000/api', 
  withCredentials: true, // OBRIGATÓRIO: Permite o envio automático dos cookies de sessão
});

export default api;
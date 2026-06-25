import api from './api';

const authService = {
  // Faz o login enviando username e password
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  // Faz o registro/cadastro de um novo usuário
  register: async (name, username, password, epitaph) => {
    const response = await api.post('/auth/register', { name, username, password, epitaph });
    return response.data;
  },

  // Faz o logout e limpa o cookie no backend
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Busca os dados do usuário logado na sessão atual (usado para persistir o login)
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export default authService;
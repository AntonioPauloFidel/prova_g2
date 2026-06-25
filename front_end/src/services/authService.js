
import api from "./api";


export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data; // { usuario }
}

export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data; // { usuario }
}

// POST /api/auth/logout
export async function logout() {
  const { data } = await api.post("/auth/logout");
  return data; // { mensagem }
}

export async function getCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data; // { usuario }
}

export default { register, login, logout, getCurrentUser };

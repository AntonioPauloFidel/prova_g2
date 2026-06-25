
import api from "./api";

// GET /api/health
export async function checkHealth() {
  const { data } = await api.get("/health");
  return data; // { status, mensagem }
}

export default { checkHealth };

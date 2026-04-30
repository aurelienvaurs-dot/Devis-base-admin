// Client Supabase admin — utilise la SERVICE ROLE KEY (accès total, pas de RLS)
const SUPA_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPA_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY; // ⚠️ Jamais exposée en prod publique

const headers = {
  apikey: SUPA_KEY,
  Authorization: `Bearer ${SUPA_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

export const db = {
  async select(table, query = "") {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${query}`, { headers });
    return r.json();
  },
  async patch(table, id, data) {
    await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH", headers, body: JSON.stringify(data),
    });
  },
  async delete_(table, id) {
    await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, { method: "DELETE", headers });
  },
  async rpc(fn, params = {}) {
    const r = await fetch(`${SUPA_URL}/rest/v1/rpc/${fn}`, {
      method: "POST", headers, body: JSON.stringify(params),
    });
    return r.json();
  },
};

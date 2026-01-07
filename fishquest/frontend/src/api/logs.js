const API_BASE = "http://localhost:3000";

export async function createCatchLog(payload, token) {
  const res = await fetch(`${API_BASE}/api/catches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer ${token}" } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Create log failed");
  return data;
}

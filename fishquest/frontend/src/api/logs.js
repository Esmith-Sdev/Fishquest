const API_URL = import.meta.env.DEV
  ? import.meta.env.VITE_LOCAL_API_URL
  : import.meta.env.VITE_API_URL;

export async function createCatchLog(payload, token) {
  const res = await fetch(`${API_URL}/api/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Create log failed");
  return data;
}

export async function fetchLogs(token) {
  const res = await fetch(`${API_URL}/api/logs`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to fetch logs");
  return data;
}

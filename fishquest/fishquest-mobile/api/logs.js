const API_URL = "https://fishquest.onrender.com";
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
export async function updateCatchLog(id, payload, token) {
  const res = await fetch(`${API_URL}/api/logs/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update log");
  }

  return res.json();
}
export async function fetchLogById(id, token) {
  const res = await fetch(`${API_URL}/api/logs/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch log");
  }

  return data;
}
export async function deleteLog(logId, token) {
  const res = await fetch(`${API_URL}/api/logs/${logId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete log");
  }

  return data;
}

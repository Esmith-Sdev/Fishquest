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
  if (!res.ok) {
    const error = new Error(data.message || "Create log failed");
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function fetchLogs(token) {
  const res = await fetch(`${API_URL}/api/logs`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) {
    const error = new Error(data.message || "Failed to fetch logs");
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function fetchBuddyLogs(buddyId, token) {
  const res = await fetch(`${API_URL}/api/logs/user/${buddyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) {
    const error = new Error(data.message || "Failed to fetch buddy logs");
    error.status = res.status;
    throw error;
  }
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
    const error = new Error(text || "Failed to update log");
    error.status = res.status;
    throw error;
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
    const error = new Error(data.message || "Failed to fetch log");
    error.status = res.status;
    throw error;
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
    const error = new Error(data.message || "Failed to delete log");
    error.status = res.status;
    throw error;
  }

  return data;
}

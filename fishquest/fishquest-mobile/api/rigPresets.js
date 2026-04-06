const API_URL = "https://fishquest.onrender.com";
export async function fetchRigPresets(token) {
  const res = await fetch(`${API_URL}/api/rig-presets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch rigs");
  return res.json();
}

export async function createRigPreset(rig, token) {
  const res = await fetch(`${API_URL}/api/rig-presets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(rig),
  });

  const data = await res.json(); // ✅ read once

  if (!res.ok) {
    throw new Error(
      data?.error || data?.message || "Failed to create rig preset",
    );
  }

  return data;
}
export async function updateRigPreset(rigId, rig, token) {
  const res = await fetch(`${API_URL}/api/rig-presets/${rigId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(rig),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.error || data?.message || "Failed to update rig preset",
    );
  }

  return data;
}

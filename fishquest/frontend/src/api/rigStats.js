const API_BASE = "http://localhost:3000";
//Fetch Rig Stats
export async function fetchRigStats(rigId, token) {
  const res = await fetch(`${API_BASE}/api/rig-stats/${rigId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch rig stats");
  }

  return data;
}

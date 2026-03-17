const API_URL = import.meta.env.DEV
  ? import.meta.env.VITE_LOCAL_API_URL
  : import.meta.env.VITE_API_URL;
//Fetch Rig Stats
export async function fetchRigStats(rigId, token) {
  const res = await fetch(`${API_URL}/api/rig-stats/${rigId}`, {
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

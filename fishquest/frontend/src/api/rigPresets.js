export async function fetchRigPresets(token) {
  const res = await fetch("/api/rig-presets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch rigs");
  return res.json();
}
export async function createRigPreset(rig, token) {
  const res = await fetch("/api/rig-presets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(rig),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create rig preset");
  }
  return res.json();
}

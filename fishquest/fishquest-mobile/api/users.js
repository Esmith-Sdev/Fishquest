const API_URL = "https://fishquest.onrender.com";

export async function fetchPreferences(token) {
  const res = await fetch(`${API_URL}/api/users/preferences`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch preferences");
  return data;
}

export async function updatePreferences(token, preferences) {
  const res = await fetch(`${API_URL}/api/users/preferences`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(preferences),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update preferences");
  return data;
}

export async function fetchBuddyProfile(token, buddyId) {
  const res = await fetch(`${API_URL}/api/users/profile/${buddyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch buddy profile");
  return data;
}

export async function toggleTrackedBuddy(token, buddyId, enabled) {
  const res = await fetch(`${API_URL}/api/users/tracked-buddies/${buddyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ enabled }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data.message || "Failed to update buddy tracking");
  return data;
}

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://fishquest.onrender.com";

export async function identifyFish(imageUrl, state, token) {
  const res = await fetch(`${API_URL}/api/identify-fish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ imageUrl, state }),
  });

  const text = await res.text();
  console.log("identifyFish status:", res.status);
  console.log("identifyFish raw response:", text);

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    throw new Error(`identifyFish returned non-JSON: ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to identify fish");
  }

  return data;
}

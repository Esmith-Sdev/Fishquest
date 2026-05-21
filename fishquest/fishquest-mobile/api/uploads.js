const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://fishquest.onrender.com";
export async function uploadImages(files, token) {
  const formData = new FormData();

  files.forEach((file, index) => {
    formData.append("images", {
      uri: file.uri,
      name: file.fileName || `image-${index}.jpg`,
      type: file.mimeType || file.type || "image/jpeg",
    });
  });

  const res = await fetch(`${API_URL}/api/uploads/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || "Upload failed");
    error.status = res.status;
    throw error;
  }

  return data.urls;
}

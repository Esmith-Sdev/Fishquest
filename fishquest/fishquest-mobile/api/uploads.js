const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://fishquest.onrender.com";
export async function uploadImages(files) {
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
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const data = await res.json();
  console.log("uploadImages response:", data);

  if (!res.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data.urls;
}

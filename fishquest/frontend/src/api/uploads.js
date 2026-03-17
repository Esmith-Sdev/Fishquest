const API_URL = import.meta.env.DEV
  ? import.meta.env.VITE_LOCAL_API_URL
  : import.meta.env.VITE_API_URL;
export async function uploadImages(files) {
  console.log("test");
  const formData = new FormData();
  files.forEach((f) => formData.append("images", f));

  const res = await fetch(`${API_URL}/api/uploads/images`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Upload Failed");
  } else {
    console.log("Upload Success");
  }

  return data.urls;
}

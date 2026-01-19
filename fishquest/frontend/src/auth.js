const API_BASE = "http://localhost:3000";
export async function login(username, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);

    localStorage.setItem("userId", data.user.userId);

    localStorage.setItem("username", data.user.username);
    return data;
  } else {
    throw new Error(data.message || "Login failed");
  }
}

export function getToken() {
  return localStorage.getItem("token");
}
export function getAuth() {
  return localStorage.getItem("username");
}
export function isAuthenticated() {
  return !!localStorage.getItem("token");
}
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
}

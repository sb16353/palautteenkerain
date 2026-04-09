const API_URL = "http://localhost:8000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    window.dispatchEvent(new Event("unauthorized"));
  }

  let data;

  try {
    data = await res.json();
  }
  catch {
    data = null;
  }

  if (!res.ok) {
    let message = "An error occurred";

    if (data?.detail) {
      if (Array.isArray(data.detail)) {
        message = data.detail.map(e => e.msg).join(", ");
      } else {
        message = data.detail;
      }
    }

    throw new Error(message);
  }

  return data;
}
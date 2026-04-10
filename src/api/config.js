export const API_URL = (import.meta.env.VITE_API_URI || "").replace(/\/+$/, "");

export const buildApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
};

export const apiFetch = (path, options = {}) => {
  return fetch(buildApiUrl(path), {
    credentials: "include",
    ...options,
  });
};

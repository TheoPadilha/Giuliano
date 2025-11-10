// giuliano-alquileres/frontend/src/config/constants.js

// VITE_API_URL pode ser fornecido com ou sem o sufixo /api.
// Normalizamos para garantir que `API_URL` termine em `/api` exatamente uma vez.
const rawApiEnv = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const normalizedApi = rawApiEnv.replace(/\/+$/g, ""); // remove trailing slashes
export const API_URL = normalizedApi.endsWith("/api")
  ? normalizedApi
  : `${normalizedApi}/api`;

const rawUploadsEnv = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000/uploads";
export const UPLOADS_URL = rawUploadsEnv.replace(/\/+$/g, "");

export const getPhotoUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith("http")) return filename;
  return `${UPLOADS_URL}/properties/${filename}`;
};

export const PROPERTY_TYPES = {
  apartment: "Apartamento",
  house: "Casa",
  studio: "Studio",
  penthouse: "Cobertura",
};

export const AMENITY_ICONS = {
  wifi: "📶",
  snowflake: "❄️",
  waves: "🏊",
  "chef-hat": "👨‍🍳",
  tv: "📺",
  "washing-machine": "🧺",
  home: "🏠",
  flame: "🔥",
  car: "🚗",
  shield: "🛡️",
};

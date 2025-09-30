// giuliano-alquileres/frontend/src/config/constants.js

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";
export const UPLOADS_URL =
  import.meta.env.VITE_UPLOADS_URL || "http://localhost:3001/uploads";

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

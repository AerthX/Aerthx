export const getMediaUrl = (value, fallback = '') => {
  if (!value) return fallback;
  if (/^https?:\/\//i.test(value)) return value;

  const base = (import.meta.env.VITE_FILE_URL || '').replace(/\/$/, '');
  const path = String(value).startsWith('/') ? value : `/${value}`;
  return `${base}${path}`;
};

const ADMIN_TOKEN_KEY = 'adminToken';

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);

export const setAdminToken = (token) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const clearAdminToken = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const isAdminAuthenticated = () => Boolean(getAdminToken());

export const extractTokenFromResponse = (payload) => {
  if (!payload || typeof payload !== 'object') return '';
  return payload.token || payload.jwt || payload.accessToken || payload.data?.token || '';
};

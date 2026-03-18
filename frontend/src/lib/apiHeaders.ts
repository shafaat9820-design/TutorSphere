export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("tutorconnect_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

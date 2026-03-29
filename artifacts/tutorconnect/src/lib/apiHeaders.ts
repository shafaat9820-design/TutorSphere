export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("tutorsphere_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

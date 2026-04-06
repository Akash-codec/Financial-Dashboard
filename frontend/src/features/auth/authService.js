import axiosInstance from "../../Utils/axiosInstance";

const API_URL = '/auth/';

const normalizeAuthResponse = (data) => {
  if (!data) return null;
  if (data.user && data.token) {
    return { ...data.user, token: data.token };
  }
  return data;
};

// Register user
const register = async (userData) => {
  const response = await axiosInstance.post(API_URL + 'register', userData);
  if (response.data) {
    const normalizedUser = normalizeAuthResponse(response.data);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    if (normalizedUser?.token) {
      localStorage.setItem('token', normalizedUser.token);
    }
    return normalizedUser;
  }
  return null;
};

// Login user
const login = async (userData) => {
  const response = await axiosInstance.post(API_URL + 'login', userData);
  if (response.data) {
    const normalizedUser = normalizeAuthResponse(response.data);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    if (normalizedUser?.token) {
      localStorage.setItem('token', normalizedUser.token);
    }
    return normalizedUser;
  }
  return null;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;

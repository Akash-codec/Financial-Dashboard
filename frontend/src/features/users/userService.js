import axiosInstance from '../../Utils/axiosInstance';

const API_URL = '/users/';

const getUsers = async (token) => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

const updateUserRole = async (id, role, token) => {
  const response = await axiosInstance.put(API_URL + id, { role });
  return response.data;
};

const userService = {
  getUsers,
  updateUserRole,
};

export default userService;

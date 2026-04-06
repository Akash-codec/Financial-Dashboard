import axiosInstance from '../../Utils/axiosInstance';

const API_URL = '/users/';

const getUsers = async (token) => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

const updateUser = async (id, updates, token) => {
  const response = await axiosInstance.put(API_URL + id, updates);
  return response.data;
};

const userService = {
  getUsers,
  updateUser,
};

export default userService;

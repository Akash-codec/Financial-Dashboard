import axiosInstance from '../../Utils/axiosInstance';

const API_URL = '/transactions/';

const getTransactions = async (token) => {
  const response = await axiosInstance.get(API_URL);
  // Support axios response wrapper object destructuring perfectly:
  if (response.data && response.data.transactions) {
    return response.data;
  }
  return response.data;
};

const createTransaction = async (transactionData, token) => {
  const response = await axiosInstance.post(API_URL, transactionData);
  return response.data;
};

const deleteTransaction = async (id, token) => {
  const response = await axiosInstance.delete(API_URL + id);
  return response.data;
};

const transactionService = {
  getTransactions,
  createTransaction,
  deleteTransaction,
};

export default transactionService;

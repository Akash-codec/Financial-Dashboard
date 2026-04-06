import axiosInstance from '../../Utils/axiosInstance';

const API_URL = '/dashboard/';

const getSummary = async (token) => {
  const response = await axiosInstance.get(API_URL + 'summary');
  return response.data;
};

const getRecentActivity = async (token) => {
  const response = await axiosInstance.get(API_URL + 'recent');
  return response.data;
};

const getCategoryTotals = async (token) => {
  const response = await axiosInstance.get(API_URL + 'category-totals');
  return response.data;
};

const getMonthlyTrends = async (token) => {
  const response = await axiosInstance.get(API_URL + 'monthly-trends');
  return response.data;
};

const dashboardService = {
  getSummary,
  getRecentActivity,
  getCategoryTotals,
  getMonthlyTrends,
};

export default dashboardService;

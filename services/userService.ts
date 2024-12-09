import axios from "../config/axios";

const userLogin = (formData: { email: string; password: string }) => {
  return axios.post(`/api/login`, formData);
};
const userRegister = (formData: {
  email: String;
  name: String;
  password: String;
}) => {
  return axios.post(`/api/register`, { ...formData, phoneNumber: "0123456" });
};
const updateProfile = (formData: {
  email?: string;
  name?: string;
  phoneNumber?: string;
  password?: string;
  id: string;
}) => {
  return axios.put(`/api/update-user`, formData);
};
const getOrderHistoryByUser = (userId: string) => {
  return axios.get(`/api/get-order-user/${userId}`);
};
export { userLogin, userRegister, updateProfile, getOrderHistoryByUser };

import axios from "../config/axios";

const userLogin = (formData: { email: string; password: string }) => {
  return axios.post(`/api/login`, formData);
};
const userRegister = (formData: {
  email: String;
  name: String;
  password: String;
}) => {
  return axios.post(`/api/register`, formData);
};
export { userLogin, userRegister };

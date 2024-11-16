import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.1.127:8080",
});

instance.interceptors.response.use((response) => {
  return response.data;
});

export default instance;


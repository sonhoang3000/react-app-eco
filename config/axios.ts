import axios from "axios";

const instance = axios.create({
  baseURL: "http://172.168.98.89:8080",
});

instance.interceptors.response.use((response) => {
  return response.data;
});

export default instance;


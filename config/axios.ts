import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.1.6:8080",
});

instance.interceptors.response.use((response) => {
  return response.data;
});

export default instance;


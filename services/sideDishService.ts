import axios from "../config/axios";

const getAllSideDishService = (id) => {
      return axios.get(`/api/get-all-side-dishes/?id=${id}`);
};

const createNewSideDishService = (data) => {
      return axios.post('/api/create-side-dish', data);
};

export { createNewSideDishService, getAllSideDishService };

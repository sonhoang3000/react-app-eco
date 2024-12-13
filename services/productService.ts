import axios from "../config/axios";

const getAllProductService = (productId) => {
    return axios.get(`/api/get-all-product/?id=${productId}`)
}
const getAllCart = () => {
    return axios.get("/api/get-all-cart")
}

export {  getAllCart, getAllProductService}


import axios from "../config/axios";

// Hàm tạo mới một đánh giá
const createNewRating = (data: { productName: string; userId: string; rating: number; comment?: string }) => {
  return axios.post("/api/rating", data);
};

// Hàm lấy danh sách đánh giá của một sản phẩm
const getListRating = (productId: string) => {
  return axios.get(`/api/rating/${productId}`);
};

// Hàm lấy tất cả các đánh giá
const getAllRating = (limit?: number) => {
  return axios.get(`/api/rating?limit=${limit || 6}`);
};

export { createNewRating, getListRating, getAllRating };

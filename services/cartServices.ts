// import axios from "../config/axios";

// // Thêm sản phẩm vào giỏ hàng
// const addToCart = async (userId: string, productId: string) => {
//   try {
//     const response = await axios.post(`/api/add-to-cart`, {
//       userId,
//       productId,
//       quantity: 1, // Mặc định số lượng là 1
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error adding product to cart:", error);
//     throw error;
//   }
// };

// // Lấy giỏ hàng của người dùng
// const getCartByUserId = (userId: string) => {
//   return axios.get(`/api/get-cart-by-userid/${userId}`);
// };

// // Cập nhật giỏ hàng
// const updateCart = (formData: { userId: string; itemId: string; number: number; quality: string }) => {
//   return axios.put(`/api/update-cart`, formData);
// };

// // Xóa sản phẩm khỏi giỏ hàng
// const deleteCart = (userId: string, itemId: string) => {
//   return axios.delete(`/api/delete-cart/${userId}`, { data: { itemId } });
// };

// // Tạo giỏ hàng mới nếu chưa có
// const createNewCart = (userId: string) => {
//   return axios.post(`/api/create-new-cart`, { userId });
// };

// export { addToCart, createNewCart, getCartByUserId, updateCart, deleteCart };

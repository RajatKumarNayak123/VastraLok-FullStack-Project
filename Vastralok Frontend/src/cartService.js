import axios from './axiosConfig'; // your axios config file with token interceptor

export const addToCart = async (productId) => {
  try {
    const response = await axios.post(`/api/cart/add`, { productId });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};
import apiClient  from "./apiClient";

const API_ENDPOINT ='/pr-category';

export const getAllCategories = async() =>{
  try{
    const response = await apiClient.get(API_ENDPOINT);
    return response.data;

  }catch(error){
    console.error('Error in categoryService.getAllCategories:', error.response ? error.response.data : error.message)
    throw error;
    
  }
};

export const createCategoryAdmin = async() => {
  try {
    const response = await apiClient.post(API_ENDPOINT, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error in categoryService.createCategoryAdmin:', error.response ? error.response.data : error.message);
    throw error;
  }
};



export const updateCategoryAdmin = async (categoryId, categoryData) => {
  try {
    const response = await apiClient.put(`${API_ENDPOINT}/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error in categoryService.updateCategoryAdmin:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteCategoryAdmin = async (categoryId) => {
  try {
    const response = await apiClient.delete(`${API_ENDPOINT}/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error in categoryService.deleteCategoryAdmin:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default {getAllCategories,createCategoryAdmin,updateCategoryAdmin,deleteCategoryAdmin}
import api from './../utils/api'

export const addNewAccountProduct = async (
    product_img,
    product_name,
    product_description,
    product_type,
    product_category,
    product_status,
    product_stock,
    product_attributes,
    product_price
) => {
    try {
        const formData = new FormData();

        formData.append("product_img", product_img);
        formData.append("product_name", product_name);
        formData.append("product_description", product_description);
        formData.append("product_type", product_type);
        formData.append("product_category", product_category);
        formData.append("product_status", product_status);
        formData.append("product_stock", product_stock);
        formData.append("product_price", product_price);
        formData.append("product_attributes", JSON.stringify(product_attributes));

    const response = await api.post(`/product/admin/add-product`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
      throw error;
  }
};

export const getProducts = async () => {
  try {
    const response = await api.get(`/product/all-products`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductForAdmin = async (productId) => {
  try {
    const response = await api.get(`/product/admin/get-product/${productId}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProductForAdmin = async (productId) => {
  try {
    const response = await api.post(`/product/admin/delete-product/${productId}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

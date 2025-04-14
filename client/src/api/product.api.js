import api from './../utils/api'

// For client
export const getProducts = async (limit) => {
  try {
    const response = await api.get(`/product/all-products`, {
      limit
    },
      {
        withCredentials: true
      }
    );
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductsByType = async (product_type, limit) => {
  try {
    const response = await api.get(`/product/products?type=${product_type}&limit=${limit}`,
      {
        withCredentials: true
      }
    );
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductBySlug = async (product_slug, limit) => {
  try {
    const response = await api.get(`/product/get-product/${product_slug}?review_limit=${limit}`,
      {
        withCredentials: true
      }
    );
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// For admin
export const addNewProduct = async (
  product_img,
  product_name,
  product_description,
  product_type,
  product_category,
  product_status,
  product_stock,
  product_attributes,
  product_price,
  isValuable
) => {
    try {
        const formData = new FormData();

        product_img.forEach((image, index) => {
            formData.append("product_img", image);
        });
        formData.append("product_name", product_name);
        formData.append("product_description", product_description);
        formData.append("product_type", product_type);
        formData.append("product_category", product_category);
        formData.append("product_status", product_status);
        formData.append("product_stock", product_stock);
        formData.append("product_price", product_price);
      formData.append("product_attributes", JSON.stringify(product_attributes));
      formData.append("isValuable", isValuable);

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
    const response = await api.delete(`/product/admin/delete-product/${productId}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAccountProductForAdmin = async (
  productId,
  productName,
  productDescription,
  productStatus,
  productPrice,
  productStock
) => {
  try {
    const response = await api.patch(`/product/admin/update-product/account/${productId}`, {
      productName,
      productDescription,
      productStatus,
      productPrice,
      productStock
    },
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTopUpProductForAdmin = async (productId, productName, productDescription, productStatus) => {
  try {
    const response = await api.patch(`/product/admin/update-product/topup/${productId}`, {
      productName,
      productDescription,
      productStatus
    },
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addAccountToProductForAdmin = async (productId, product_attributes_data) => {
  try {
    const response = await api.patch(`/product/admin/update-product/add-account/${productId}`, {
      product_attributes_data
    },
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const addPackageToProductForAdmin = async (productId, product_attributes_data) => {
  try {
    const response = await api.patch(`/product/admin/update-product/add-package/${productId}`, {
      product_attributes_data
    },
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAccountFromProductForAdmin = async (productId, accountId) => {
  try {
    const response = await api.patch(`/product/admin/update-product/delete-account/${productId}/${accountId}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePackageFromProductForAdmin = async (productId, packageId) => {
  try {
    const response = await api.patch(`/product/admin/update-product/delete-package/${productId}/${packageId}`,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

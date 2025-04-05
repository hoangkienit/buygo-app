const allowedExtensions = ["jpg", "jpeg", "png"];

export const getFileType = (uri) => {
  const fileExtension = uri.split('.').pop().toLowerCase();
  
  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error("Invalid file type. Only JPG and PNG are allowed.");
  }

  return fileExtension === "png" ? "image/png" : "image/jpeg";
};

export const getProductTypeObject = (selectedType) => {
        switch (selectedType) {
            case "topup_package":
                return { name: "", price: 0 }
            case "game_account":
                return { username: "", password: "" }     
            default:
                return {}
        }
}
    
export const statusType = (type) => {
    switch (type) {
      case "success":
        return "transaction-success";
      case "pending":
        return "transaction-pending";
      case "failed":
        return "transaction-failed";
      default:
        break;
    }
}
  
export const statusText = (type) => {
    switch (type) {
      case "success":
        return "Thành công";
      case "pending":
        return "Đang chờ";
      case "failed":
        return "Thất bại";
      default:
        break;
    }
}
  
export const paymentMethodText = (type) => {
    switch (type) {
      case "bank_transfer":
        return "Ngân hàng";
      case "card":
        return "Thẻ cào";
      case "momo":
        return "Momo";
      default:
        break;
    }
}
  

export const productTypeText = (type) => {
    switch (type) {
      case "topup_package":
        return "Gói nạp";
      case "game_account":
        return "Tài khoản game";
      case "utility_account":
        return "Tài khoản tiện ích";
      default:
        break;
    }
}

export const productAttributesStatusText = (type) => {
    switch (type) {
      case "available":
        return "Có sẵn";
      case "order":
        return "Order";
      default:
        break;
    }
}
  
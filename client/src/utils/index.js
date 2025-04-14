import NEWBIE from './../assets/images/ranking/newbie.png';
import BRONZE from './../assets/images/ranking/bronze.png';
import SILVER from './../assets/images/ranking/silver.png';
import GOLD from './../assets/images/ranking/gold.png';
import PLATINUM from './../assets/images/ranking/platinum.png';
import DIAMOND from './../assets/images/ranking/diamond.png';

const allowedExtensions = ["jpg", "jpeg", "png"];


export const getFileType = (uri) => {
  const fileExtension = uri.split(".").pop().toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error("Invalid file type. Only JPG and PNG are allowed.");
  }

  return fileExtension === "png" ? "image/png" : "image/jpeg";
};

export const getProductTypeObject = (selectedType) => {
  switch (selectedType) {
    case "topup_package":
      return { name: "", price: 0 };
    case "game_account":
      return { username: "", password: "" };
    case "utility_account":
      return { username: "", password: "" };
    default:
      return {};
  }
};

export const getUserRankImageURL = (rank) => {
  switch (rank) {
    case "newbie":
      return NEWBIE;
    case "bronze":
      return BRONZE;
    case "silver":
      return SILVER;
    case "gold":
      return GOLD;
    case "platinum":
      return PLATINUM;
    case "diamond":
      return DIAMOND;

    default:
      return "";
  }
};


export const statusType = (type) => {
  switch (type) {
    case "success":
      return "transaction-success";
    case "pending":
      return "transaction-pending";
    case "failed":
      return "transaction-failed";
    case "processing":
      return "transaction-pending";
    default:
      break;
  }
};

export const statusText = (type) => {
  switch (type) {
    case "success":
      return "Thành công";
    case "pending":
      return "Đang chờ";
    case "failed":
      return "Thất bại";
    case "processing":
      return "Đang xử lí";
    default:
      break;
  }
};

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
};

export const statusClass = (status) => {
  switch (status) {
    case "pending":
      return "pending-status";
    case "success":
      return "success-status";
    case "failed":
      return "failed-status";
    case "processing":
      return "pending-status";

    default:
      return "";
  }
};

export const orderStatusStep = (status) => {
  switch (status) {
    case "success":
      return 2;
    case "failed":
      return 2;
    case "processing":
      return 1;

    default:
      return "";
  }
};

export const userStatusText = (status) => {
  switch (status) {
    case "active":
      return "Hoạt động";
    case "inactive":
      return "Không hoạt động";
    case "banned":
      return "Bị cấm";

    default:
      return "";
  }
};

export const userRankText = (rank) => {
  switch (rank) {
    case "newbie":
      return "Người mới";
    case "bronze":
      return "Đồng";
    case "silver":
      return "Bạc";
    case "gold":
      return "Vàng";
    case "platinum":
      return "Bạch kim";
    case "diamond":
      return "Kim cương";

    default:
      return "";
  }
};

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
};

export const productAttributesStatusText = (type) => {
  switch (type) {
    case "available":
      return "Có sẵn";
    case "order":
      return "Order";
    default:
      break;
  }
};

export const transactionHistoryPaymentMethodText = (type) => {
  switch (type) {
    case "bank_transfer":
      return "Ngân hàng";
    case "momo":
      return "Momo";
    case "card":
      return "Thẻ cào";
    default:
      break;
  }
};

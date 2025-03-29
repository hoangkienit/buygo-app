export const handleError = (error) => {
  if (error.response) {
    const message = error.response.data.message;
    console.log(error);
    throw new Error(message || "Có lỗi xảy ra.");
  } else if (error.request) {
    throw new Error("Lỗi mạng! Vui lòng kiểm tra kết nối của bạn.");
  } else {
    throw new Error(error);
  }
};

export const handleUnauthorizedError = (message, navigate) => {
    if (message === "Session expired" || message === "Invalid token" || message === "Token not found") {
        navigate('/logout');
    }
}

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './toast.css'

const ToastNotification = () => {
  return <ToastContainer/>;
};

// Function to trigger toast
export const showToast = (message, type = "error") => {
  toast[type](message, {
    position: "bottom-right",
    autoClose: 5000,
    closeButton: false,
    className: `custom-toast`,
  });
};

export default ToastNotification;

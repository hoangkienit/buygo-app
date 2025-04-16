import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AccountLayout from "../layouts/AccountLayout";
import "./../styles/order-detail.css";
import { FaArrowCircleLeft } from "react-icons/fa";
import { Step, Stepper } from "react-form-stepper";
import { orderStatusStep, statusText } from "../utils";
import { HashLoader } from "react-spinners";
import ToastNotification, {
  showToast,
} from "../components/toasts/ToastNotification";
import { getOrder } from "../api/order.api";
import { useUser } from "../context/UserContext";
import socket from "../services/socket";
import FeedbackModal from "../components/modal/feedback-modal";
import { MdOutlineInsertComment } from "react-icons/md";
import StarRating from "./../components/star-rating/star-rating";

export const OrderDetail = () => {
  const { user } = useUser();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const [isInvalidOrder, setIsInvalidOrder] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [isFeedbackModal, setIsFeedbackModal] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleMarkOrderStatus = useCallback(async ({ order_status }) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      order_status: order_status,
    }));
    setCurrentStep(orderStatusStep(order_status));
  }, []);

  useEffect(() => {
    if (user?._id && socket) {
      socket.connect();
      socket.emit("join", user._id);
      socket.on("markAsSuccess", handleMarkOrderStatus);
      socket.on("markAsFailed", handleMarkOrderStatus);

      return () => {
        socket.off("markAsSuccess", handleMarkOrderStatus);
        socket.off("markAsFailed", handleMarkOrderStatus);
        socket.disconnect();
      };
    }
  }, [user?._id, handleMarkOrderStatus, socket]);

  const fetchOrder = async () => {
    setLoading(true);

    try {
      const res = await getOrder(orderId);

      if (res?.success) {
        setOrder(res.data.order || null);
        setCurrentStep(orderStatusStep(res?.data?.order?.order_status));
        setIsReviewed(res.data.order.review ? true : false);

        if (!order) {
          setIsInvalidOrder(true);
          return;
        }
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const order_package = order?.product?.product_attributes?.packages?.find(
    (pack) => String(pack._id) === String(order?.order_attributes?.packageId)
  );

  if (!isInvalidOrder) {
    return (
      <AccountLayout title="Đơn hàng">
        <div className="client-order-detail-container">
          <p
            style={{
              fontFamily: "montserrat-bold",
              fontSize: "15px",
              color: "#fff",
            }}
          >
            Đơn hàng không tồn tại
          </p>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title="Đơn hàng">
      <div className="client-order-detail-container">
        <ToastNotification />
        <FeedbackModal
          isOpen={isFeedbackModal}
          onClose={() => setIsFeedbackModal(false)}
          productId={order?.productId}
          orderId={order?.orderId}
          setIsReviewed={setIsReviewed}
          setOrder={setOrder}
        />
        {loading ? (
          <div className="loader-container">
            <HashLoader color="#fff" />
          </div>
        ) : (
          <>
            <div className="client-order-orderId-container">
              <FaArrowCircleLeft
                onClick={() => navigate("/order")}
                className="client-order-back-icon"
              />
              <div className="client-order-time-container">
                <p className="client-order-orderId">#{orderId}</p>
                <p className="client-order-time">
                  Đặt hàng lúc{" "}
                  {new Date(order?.createdAt).toLocaleString() || ""}
                </p>
              </div>
            </div>

            <Stepper
              className="client-stepper"
              activeStep={currentStep}
              styleConfig={{
                activeBgColor: "#134977",
                activeTextColor: "#fff",
                inactiveBgColor: "#e0e0e0",
                inactiveTextColor: "#000",
                completedBgColor: "#134977",
                completedTextColor: "#fff",
              }}
            >
              <Step label="Đặt hàng" />
              <Step label="Đang xử lí" />
              <Step
                label={
                  order?.order_status === "processing"
                    ? ""
                    : `${statusText(order?.order_status)}`
                }
              />
            </Stepper>
            <div className="client-order-product-section-container">
              <div className="client-order-product-left-side">
                <div className="client-order-product-info-container">
                  <img
                    className="order-detail-product-image"
                    src={order?.product?.product_imgs[0]}
                    alt="product-image"
                  />
                  <div className="order-detail-name-container">
                    <p className="client-order-product-name">
                      {order?.product?.product_name}
                    </p>
                    {order?.order_type === "topup_package" && (
                      <p className="client-order-attribute-text">
                        {order_package.name}
                      </p>
                    )}
                    {order?.order_type === "utility_account" && (
                      <>
                        <p className="client-order-attribute-text">
                          {order?.order_attributes?.username}
                        </p>
                        <p className="client-order-attribute-text">
                          {order?.order_attributes?.password}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {order?.order_status === "success" && (
                  <button
                    onClick={() => setIsFeedbackModal(true)}
                    className={`write-review-button ${
                      isReviewed ? "disabled-review-button" : ""
                    }`}
                  >
                    {isReviewed
                      ? "Đơn hàng đã được đánh giá"
                      : "Đánh giá đơn hàng"}
                  </button>
                )}
              </div>
              <div className="client-order-product-right-side">
                <div className="order-log-container client-order-log-container">
                  <p className="order-log">
                    Đơn hàng được tạo vào lúc{" "}
                    <span className="order-time client-order-timeline">
                      {new Date(order?.createdAt).toLocaleString()}
                    </span>
                  </p>
                  <p className="order-log">
                    Đơn hàng cập nhật vào lúc{" "}
                    <span className="order-time client-order-timeline">
                      {new Date(order?.updatedAt).toLocaleString()}
                    </span>
                  </p>
                  {order?.discountCode && (
                    <p className="order-log">
                      Đơn hàng sử dụng mã{" "}
                      <span className="order-time client-order-timeline">
                        {order?.discountCode}
                      </span>
                    </p>
                  )}

                  <p className="order-log">
                    Nội dung:{" "}
                    <span className="order-time client-order-timeline">
                      {order?.order_note || ""}
                    </span>
                  </p>

                  <div className="order-summary-container order-price-section-container">
                    <div className="order-summary-line">
                      <span>Tạm tính:</span>
                      <span>
                        {order?.order_base_amount?.toLocaleString() || 0}đ
                      </span>
                    </div>
                    <div className="order-summary-line">
                      <span>Giảm giá:</span>
                      <span>
                        -{order?.order_discount_amount?.toLocaleString() || 0}đ
                      </span>
                    </div>
                    <div className="order-summary-total">
                      <strong>Tổng đã thanh toán:</strong>
                      <strong>
                        {order?.order_final_amount?.toLocaleString() || 0}đ
                      </strong>
                    </div>
                  </div>
                </div>
                {isReviewed && (
                  <div className="order-detail-review-container">
                    <div className="order-detail-review-header">
                      <MdOutlineInsertComment className="order-detail-review-header-icon" />
                      <p className="order-detail-review-header-text">
                        Đánh giá của bạn
                      </p>
                    </div>
                    <div className="comment-rating-container">
                      <p className="order-detail-comment">
                        {order?.review?.comment || "No comment"}
                      </p>
                      <StarRating rating={order?.review?.rating || 5} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AccountLayout>
  );
};

import React, { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { io } from "socket.io-client";
import "../styles/recharge.css";
import AccountLayout from "../layouts/AccountLayout";
import { GrFormNextLink } from "react-icons/gr";
import { useUser } from "../context/UserContext";

const SOCKET_URL = "https://your-ngrok-subdomain.ngrok-free.app"; // Replace with your ngrok URL
const socket = io(SOCKET_URL, { autoConnect: false });

const Recharge = () => {
  const { user } = useUser();
  const [amount, setAmount] = useState("");
  const [isRecharging, setIsRecharging] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const amounts = [10000, 20000, 50000, 100000, 200000, 300000, 500000, 700000, 900000, 1000000];

  useEffect(() => {
    // Set favicon dynamically
    const link = document.querySelector("link[rel='icon']");
    if (link) {
      link.href = "./../public/web_tab_logo.png";
    }

    // Connect socket when the user enters recharge page
    if (user?._id) {
      socket.connect();
      console.log("🔄 Connecting to socket...");
      socket.emit("join", user._id);

      // Listen for successful payment
      socket.on("recharge_success", ({ transferAmount, gateway }) => {
        setPaymentSuccess(true);
        setIsRecharging(false);
        alert(`✅ Nạp tiền thành công: ${transferAmount.toLocaleString()}đ, ${gateway}`);
      });

      return () => {
        socket.off("recharge_success"); // Clean up event listener
        socket.disconnect();
      };
    }
  }, [user?._id]);

  const handleRecharge = () => {
    setIsRecharging(true);
    setPaymentSuccess(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <AccountLayout title={"Nạp tiền"}>
      <div className="recharge-container">
        <h2>Nạp tiền</h2>

        {paymentSuccess ? (
          <div className="success-box">
            🎉 Bạn đã nạp tiền thành công!
          </div>
        ) : (
          !isRecharging ? (
            <>
              <div className="amount-options">
                {amounts.map((amt) => (
                  <button
                    key={amt}
                    className={`amount-button ${amount === amt ? "selected" : ""}`}
                    onClick={() => setAmount(amt)}
                  >
                    <p className="amount-text">{amt.toLocaleString()}đ</p>
                  </button>
                ))}
              </div>
              <div className="recharge-button-wrapper">
                <button onClick={handleRecharge} disabled={!amount} className="recharge-button">
                  <GrFormNextLink className="recharge-icon" />
                </button>
              </div>
            </>
          ) : (
            <div className="payment-confirmation">
              <img
                src={`https://qr.sepay.vn/img?acc=07014137401&bank=TPBank&amount=${amount}&des=TKPBG2 ${user?._id || 1000}`}
                alt="QR Code"
                className="qr-image"
              />

              <div className="payment-details">
                <p>
                  <span className="label">Số tiền:</span>
                  <span className="value">{amount.toLocaleString()}đ</span>
                </p>
                <p>
                  <span className="label">Ngân hàng:</span>
                  <span className="value">TP Bank</span>
                </p>
                <p className="copy-row">
                  <span className="label">Số tài khoản:</span>
                  <div className="copy-row-value">
                    <span className="value">07014137401</span>
                    <Copy className="copy-icon" onClick={() => copyToClipboard("07014137401")} />
                  </div>
                </p>
                <p className="copy-row">
                  <span className="label">Nội dung chuyển khoản:</span>
                  <div className="copy-row-value">
                    <span className="value">TKPBG2 {user?._id || 1000}</span>
                    <Copy className="copy-icon" onClick={() => copyToClipboard(`TKPBG2 ${user?._id || 1000}`)} />
                  </div>
                </p>
                <div className="warning-box">
                  <p className="warning-text">
                    ⚠ Sau khi thanh toán thành công, bạn hãy đợi một vài phút để cập nhật tiền lên hệ thống nhé!
                  </p>
                </div>
              </div>

              <button className="back-button" onClick={() => setIsRecharging(false)}>Quay lại</button>
            </div>
          )
        )}
      </div>
    </AccountLayout>
  );
};

export default Recharge;

import React, { useEffect, useState, useCallback } from "react";
import { Copy } from "lucide-react";
import { AiFillCheckCircle } from "react-icons/ai";
import { GrFormNextLink } from "react-icons/gr";
import "../styles/recharge.css";
import AccountLayout from "../layouts/AccountLayout";
import { useUser } from "../context/UserContext";
import socket from "../services/socket";

const Recharge = () => {
  const { user, updateBalance } = useUser();
  const [amount, setAmount] = useState("");
  const [isRecharging, setIsRecharging] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successObj, setSuccessObj] = useState(null);

  const amounts = [10000, 20000, 50000, 100000, 200000, 300000, 500000, 700000, 900000, 1000000];

  const handleRechargeSuccess = useCallback(async ({ transferAmount, gateway }) => {
    await updateBalance(transferAmount);
    setSuccessObj({ amount: transferAmount, gateway });
    setPaymentSuccess(true);
    setIsRecharging(false);
  }, [updateBalance]);

  useEffect(() => {
    if (user?._id) {
      socket.connect();
      console.log("🔄 Connecting to socket...");
      socket.emit("join", user._id);
      socket.on("recharge_success", handleRechargeSuccess);

      return () => {
        socket.off("recharge_success", handleRechargeSuccess);
        socket.disconnect();
      };
    }
  }, [user?._id, handleRechargeSuccess]);

  const handleRecharge = () => {
    setIsRecharging(true);
    setPaymentSuccess(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <AccountLayout title="Nạp tiền">
      <div className="recharge-container">
        <h2>Nạp tiền</h2>

        {paymentSuccess ? (
          <SuccessMessage successObj={successObj} onBack={() => setPaymentSuccess(false)} />
        ) : !isRecharging ? (
          <AmountSelection
            amounts={amounts}
            selectedAmount={amount}
            setAmount={setAmount}
            onRecharge={handleRecharge}
          />
        ) : (
          <PaymentConfirmation
            amount={amount}
            userId={user?._id || 1000}
            copyToClipboard={copyToClipboard}
            onBack={() => setIsRecharging(false)}
          />
        )}
      </div>
    </AccountLayout>
  );
};

const SuccessMessage = ({ successObj, onBack }) => (
  <>
    <div className="success-box">
    <AiFillCheckCircle className="success-icon" />
    <p>
      🎉 Bạn đã nạp tiền thành công với số tiền
      <span className="success-amount"> {successObj?.amount.toLocaleString()}đ</span> qua{" "}
      <span className="success-gateway">{successObj?.gateway}</span>! 🚀
    </p>
  </div>
    <a className="back-to-selection-button" onClick={onBack}>
      Nạp thêm
    </a>
  </>
);

const AmountSelection = ({ amounts, selectedAmount, setAmount, onRecharge }) => (
  <>
    <div className="amount-options">
      {amounts.map((amt) => (
        <button
          key={amt}
          className={`amount-button ${selectedAmount === amt ? "selected" : ""}`}
          onClick={() => setAmount(amt)}
        >
          <p className="amount-text">{amt.toLocaleString()}đ</p>
        </button>
      ))}
    </div>
    <div className="recharge-button-wrapper">
      <button onClick={onRecharge} disabled={!selectedAmount} className="recharge-button">
        <GrFormNextLink className="recharge-icon" />
      </button>
    </div>
  </>
);

const PaymentConfirmation = ({ amount, userId, copyToClipboard, onBack }) => (
  <div className="payment-confirmation">
    <img
      src={`https://qr.sepay.vn/img?acc=07014137401&bank=TPBank&amount=${amount}&des=TKPBG2 ${userId}`}
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
      <CopyRow label="Số tài khoản" value="07014137401" copyToClipboard={() => copyToClipboard("07014137401")} />
      <CopyRow label="Nội dung chuyển khoản" value={`TKPBG2 ${userId}`} copyToClipboard={() => copyToClipboard(`TKPBG2 ${userId}`)} />
      <div className="warning-box">
        <p className="warning-text">
          ⚠ Sau khi thanh toán thành công, bạn hãy đợi một vài phút để cập nhật tiền lên hệ thống nhé!
        </p>
      </div>
    </div>

    <button className="back-button" onClick={onBack}>
      Quay lại
    </button>
  </div>
);

const CopyRow = ({ label, value, copyToClipboard }) => (
  <div className="copy-row">
    <span className="label">{label}:</span>
    <div className="copy-row-value">
      <span className="value">{value}</span>
      <Copy className="copy-icon" onClick={copyToClipboard} />
    </div>
  </div>
);

export default Recharge;

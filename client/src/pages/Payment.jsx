import React, { useEffect, useState,  useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";
import { AiFillCheckCircle } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import socket from "../services/socket";
import { ClipLoader, HashLoader } from "react-spinners";
import AccountLayout from "../layouts/AccountLayout";
import { cancelTransaction, getTransaction } from "../api/transaction.api";
import CountdownTimer from "../components/timer-count/timer-count";
import { truncateText } from "../utils/text";
import { useUser } from "../context/UserContext";
import { handleUnauthorizedError } from "../utils/handleError";
import ConfirmationModal from "../components/confirm-box/confirm-box";

const Payment = () => {
    const { transactionId } = useParams();
    const { user, updateBalance } = useUser();
    const [successObj, setSuccessObj] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(true);
    const [status, setStatus] = useState(pending ? "Đang chờ" : "Thành công");
    const [transactionData, setTransactionData] = useState(null);
    const [timerReset, setTimerReset] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleRechargeSuccess = useCallback(async ({ newBalance, gateway, transferAmount }) => {
        await updateBalance(newBalance);
        setSuccessObj({ amount: transferAmount, gateway });
        setPending(false);
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
    
    useEffect(() => {
        checkNewTransaction();
        getTransactionData();
    }, [transactionId]);

    const checkNewTransaction = () => {
        const lastTransactionId = localStorage.getItem("lastTransactionId");

        if (lastTransactionId !== transactionId) {
            setTimerReset(true);
            localStorage.setItem("lastTransactionId", transactionId);
            localStorage.removeItem("countdownEndTime"); // Reset timer storage
        } else {
            setTimerReset(false);
        }
    };

    const getTransactionData = async () => {
        try {
            setLoading(true);
            const res = await getTransaction(transactionId);

            if (res.success) {
                setLoading(false);
                setTransactionData(res.data.transaction);
            }
        } catch (error) {
          setLoading(false);
          handleUnauthorizedError(error.message, navigate);
          console.log(error.message);
        }
    }
    
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const onCancelTransaction = async() => {
      try {
        setLoading(true);
        const res = await cancelTransaction(transactionId);

        if (res.success) {
          setShowModal(false);
          navigate('/account/recharge');
        }
      } catch (error) {
        handleUnauthorizedError(error.message, navigate);
      } finally {
        setLoading(false);
      }
    }

    const onTimeUp = () => {
        navigate('/account/recharge');
    }

  return (
    <AccountLayout title={'Nạp tiền'}>
        {loading ? <div className="loading-container"><ClipLoader size={30} color="#fff"></ClipLoader></div>
            :
              <div className="payment-confirmation">
                  <div className="timer-count-container">
                      <CountdownTimer initialTime={3600} onTimeUp={onTimeUp} resetTime={timerReset ? 3600 : null}/>
                  </div>
                <img
                src={`https://qr.sepay.vn/img?acc=07014137401&bank=TPBank&amount=${transactionData?.amount || 0}&des=TKPBG2 ${transactionData?.transactionId} ${transactionData?.userId}`}
                alt="QR Code"
                className="qr-image"
                />

            <div className="payment-details">
      <p>
        <span className="label">Số tiền:</span>
        <span className="value">{(transactionData?.amount || 0).toLocaleString()}đ</span>
      </p>
      <p>
        <span className="label">Ngân hàng:</span>
        <span className="value">TP Bank</span>
      </p>
      <CopyRow label="Số tài khoản" value="07014137401" copyToClipboard={() => copyToClipboard("07014137401")} />
        <CopyRow label="Nội dung" value={truncateText(`TKPBG2 ${transactionData?.transactionId} ${transactionData?.userId}`, 20)} copyToClipboard={() => copyToClipboard(`TKPBG2 ${transactionData?.transactionId} ${transactionData?.userId}`)} />
        <CopyRow label="Mã giao dịch" value={`${transactionData?.transactionId}`} copyToClipboard={() => copyToClipboard(`${transactionData?.transactionId}`)} />
        <StatusRow label="Trạng thái" value={`${status}`} pending={pending} />

        {/* Warning and Success box*/}  
        {pending ?
            <div className="warning-box">
                <p className="warning-text">
                ⚠️ Sau khi thanh toán thành công, bạn hãy đợi một vài phút để cập nhật tiền lên hệ thống nhé!
                </p>
            </div>  
            : 
            <div className="success-box-container">
                <p className="success-text">
                ✅ Nạp thành công <span className="success-amount-text">{successObj?.amount.toLocaleString() || 0}</span> từ <span className="success-amount-text">{successObj?.gateway || "TP Bank"}</span>
                </p>
            </div>              
        }             

    </div>

    <button className="back-button" onClick={() => setShowModal(true)}>
      Hủy giao dịch
    </button>
          {showModal && (
        <ConfirmationModal
          message="Nếu bạn đã chuyển khoản thành công mà hệ thống chưa cập nhật tiền, bạn hãy lưu ảnh chụp màn hình chuyển khoản và liên hệ với Admin để giải quyết nhé."
          onConfirm={onCancelTransaction}
          onClose={() => setShowModal(false)} // Close modal when clicking cancel or outside
        />
      )}
  </div>
        }
      </AccountLayout>
  );
};

const CopyRow = ({ label, value, copyToClipboard }) => (
  <div className="copy-row">
    <span className="label">{label}:</span>
    <div className="copy-row-value">
      <span className="value">{value}</span>
      <Copy className="copy-icon" onClick={copyToClipboard} />
    </div>
  </div>
);

const StatusRow = ({ pending, label, value }) => (
  <div className="copy-row">
    <span className="label">{label}:</span>
    <div className="copy-row-value">
      <span className={`value status-value ${pending ? "pending":"success"}`}>{value}</span>
      {pending ? <HashLoader className="pending-loader" size={20} color="#ffcc00"></HashLoader> : <FaCheckCircle className="pending-loader success-icon"/>}
    </div>
  </div>
);

export default Payment;

import React, { useEffect, useState } from "react";
import { GrFormNextLink } from "react-icons/gr";
import "../styles/recharge.css";
import AccountLayout from "../layouts/AccountLayout";
import { useNavigate } from "react-router-dom";
import { createTransaction } from "../api/transaction.api";
import { ClipLoader } from "react-spinners";
import ToastNotification, { showToast } from "../components/toasts/ToastNotification";

const Recharge = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const amounts = [10000, 20000, 50000, 100000, 200000, 300000, 500000, 700000, 900000, 1000000];

  const handleRecharge = async () => {
    setLoading(true);
    try {
      const res = await createTransaction(amount, "empty_gateway", "bank_transfer");

      if (res.success) {
        setLoading(false);
        navigate(`/recharge/${res?.data?.transactionId}`);
      }
    } catch (error) {
      setLoading(false);
      showToast(error.message, "error");
    }
  };


  return (
    <AccountLayout title="Nạp tiền">
      <div className="recharge-container">
        <h2>Nạp tiền</h2>

        <AmountSelection
            amounts={amounts}
            selectedAmount={amount}
          setAmount={setAmount}
          loading={loading}
            onRecharge={handleRecharge}
        />
        <ToastNotification/>
      </div>
    </AccountLayout>
  );
};

const AmountSelection = ({ amounts, selectedAmount, setAmount, onRecharge, loading }) => (
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
        {loading ? <ClipLoader size={20} color="#fff"/> : <GrFormNextLink className="recharge-icon" />}
      </button>
    </div>
  </>
);



export default Recharge;

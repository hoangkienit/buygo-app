import React from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import "./success-box.css"; // Import the CSS file

const SuccessBox = ({ amount = "10.000đ", method = "Stripe" }) => {
  return (
    <div className="success-box">
      <AiFillCheckCircle className="success-icon" />
      <p className="success-message">
        You have been recharged successfully with <span className="amount">{amount}</span> via {method}.
      </p>
    </div>
  );
};

export default SuccessBox;

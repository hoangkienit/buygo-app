import React, { useState } from 'react';
import axios from 'axios';
import './product-status-switch.css'

const ProductStatusSwitch = ({  active }) => {
  const [isActive, setIsActive] = useState(active); // Initial state, assuming product is active by default

  // Function to handle the status toggle
  const handleToggle = async () => {
    const updatedStatus = !isActive;

    // Update the local state
    setIsActive(updatedStatus);
  };

  return (
    <div>
      <label className="switch">
        <input type="checkbox" checked={isActive} onChange={handleToggle} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ProductStatusSwitch;

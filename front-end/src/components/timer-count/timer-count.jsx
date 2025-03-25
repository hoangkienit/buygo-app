import React, { useState, useEffect } from "react";
import './timer-count.css';

const CountdownTimer = ({ initialTime = 3600, resetTime, onTimeUp }) => {
  const getStoredTime = () => {
    const savedTime = localStorage.getItem("countdownEndTime");
    if (savedTime) {
      const remainingTime = Math.floor((parseInt(savedTime) - Date.now()) / 1000);
      return remainingTime > 0 ? remainingTime : 0;
    }
    return initialTime;
  };

  const [timeLeft, setTimeLeft] = useState(getStoredTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      localStorage.removeItem("countdownEndTime");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime > 0) {
          localStorage.setItem("countdownEndTime", Date.now() + newTime * 1000);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  useEffect(() => {
    if (resetTime) {
      localStorage.setItem("countdownEndTime", Date.now() + resetTime * 1000);
        setTimeLeft(resetTime);
    }
  }, [resetTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  return (
    <div className="timer" style={{ color: timeLeft > 10 ? "white" : "red" }}>
      ⌛ {formatTime(timeLeft)}
    </div>
  );
};

export default CountdownTimer;

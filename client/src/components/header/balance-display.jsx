import CountUp from "react-countup";
import { useRef } from "react";
import { useUser } from "./../../context/UserContext";

export const BalanceDisplay = () => {
  const { user } = useUser();
  const previousBalanceRef = useRef(user?.balance || 0);
  const currentBalance = user?.balance || 0;

  const start = previousBalanceRef.current;
  const end = currentBalance;

  // Update ref after rendering
  if (start !== end) {
    previousBalanceRef.current = end;
  }

  return (
    <span className="balance">
      <CountUp
        start={start}
        end={end}
        duration={2}
        separator="."
        suffix="đ"
      />
    </span>
  );
};

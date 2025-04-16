import { useEffect, useState } from "react";
import "./../styles/rank.css";
import AccountLayout from "../layouts/AccountLayout";
import { HashLoader } from "react-spinners";
import { showToast } from "../components/toasts/ToastNotification";
import { getUserTotalDeposit } from "../api/user.api";
import { useUser } from "../context/UserContext";

const rankData = [
    { level: 6, title: "VIP", points: 100000000, color: "#7C3AED" },
  { level: 5, title: "Kim cương", points: 40000000, color: "#7C3AED" },
  { level: 4, title: "Bạch kim", points: 20000000, color: "#8B5CF6" },
  { level: 3, title: "Vàng", points: 2000000, color: "#A78BFA" },
  { level: 2, title: "Bạc", points: 1000000, color: "#C4B5FD" },
  { level: 1, title: "Đồng", points: 0, color: "#DDD6FE" },
];
const Rank = () => {
  const [userPoints, setUserPoints] = useState(0);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
  // Function to determine if a rank is achieved
  const isRankAchieved = (rankPoints) => userPoints >= rankPoints;

    useEffect(() => {
        fetchUserTotalDeposit();
        document.title = 'Xếp hạng của bạn';
    }, [user?._id]);
    const fetchUserTotalDeposit = async () => {
        setLoading(true);

        try {
            const res = await getUserTotalDeposit(user?._id);

            if (res.success) {
                setUserPoints(res.data?.totalDeposit || 0);
            }
        } catch (error) {
            showToast(error.message, "error");
        }
        finally {
            setLoading(false);
        }
  };
  // Function to determine current rank
  const getCurrentRank = () => {
    for (let i = 0; i < rankData.length; i++) {
      if (userPoints >= rankData[i].points) {
        return rankData[i];
      }
    }
    return rankData[rankData.length - 1];
  };

  // Determine next rank
  const getNextRank = () => {
    const currentRankIndex = rankData.findIndex(
      (rank) => rank.points <= userPoints
    );
    if (currentRankIndex <= 0) return null; // Already at highest rank
    return rankData[currentRankIndex - 1];
  };

  const currentRank = getCurrentRank();
  const nextRank = getNextRank();

  // Calculate progress percentage to next rank
  const calculateProgress = () => {
    if (!nextRank) return 100;

    const rangeStart = currentRank.points;
    const rangeEnd = nextRank.points;
    const pointsInRange = rangeEnd - rangeStart;
    const userPointsInRange = userPoints - rangeStart;

    return Math.min(Math.floor((userPointsInRange / pointsInRange) * 100), 100);
  };

  const progressPercentage = calculateProgress();

  return (
    <AccountLayout>
      <div className="rank-container">
        {loading ? (
          <div className="loader-container">
            <HashLoader color="#fff" size={30} />
          </div>
        ) : (
          <>
            <div className="rank-header">
              <h2 className="rank-title">Xếp hạng của bạn</h2>
              <p className="rank-subtitle">Tiếp tục để mở khóa cấp độ mới</p>
            </div>

            <div className="rank-user-card">
              <div className="rank-user-points">{userPoints.toLocaleString()}đ</div>
              <div className="rank-user-level">
                Cấp {currentRank.level}: {currentRank.title}
              </div>
              {nextRank && (
                <div className="rank-progress-info">
                  <div className="rank-progress-details">
                    <span>{progressPercentage}% hoàn thành</span>
                    <span>
                      {(nextRank.points - userPoints).toLocaleString()}đ để tăng lên cấp {" "}
                      {nextRank.level}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="rank-progress-wrapper">
              <div className="rank-progress-layout">
                {/* Vertical progress bar container */}
                <div className="rank-progress-bar-container">
                  {/* The actual progress fill with gradient */}
                  <div
                    className="rank-progress-bar-fill"
                    style={{
                      height: `${progressPercentage}%`,
                      background: `linear-gradient(to top, ${
                        currentRank.color
                      }, ${nextRank ? nextRank.color : currentRank.color})`,
                    }}
                  ></div>
                </div>

                {/* Rank level indicators */}
                <div className="rank-level-indicators">
                  {rankData.map((rank, index) => {
                    const achieved = isRankAchieved(rank.points);
                    const isCurrent = currentRank.level === rank.level;

                    return (
                      <div key={rank.level} className="rank-level-indicator">
                        {/* Modern dot indicator */}
                        <div
                          className={`rank-level-dot ${
                            achieved ? "rank-level-achieved" : ""
                          } ${isCurrent ? "rank-level-current" : ""}`}
                        >
                          {achieved && (
                            <svg
                              className="rank-check-icon"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>

                        {/* Level text with modern styling */}
                        <div className="rank-level-text">
                          <div
                            className={`rank-level-title ${
                              achieved ? "rank-achieved-text" : ""
                            }`}
                          >
                            {rank.title}
                          </div>
                          <div
                            className={`rank-level-points ${
                              achieved ? "rank-achieved-points" : ""
                            }`}
                          >
                            {rank.points.toLocaleString()}đ
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AccountLayout>
  );
};

export default Rank;

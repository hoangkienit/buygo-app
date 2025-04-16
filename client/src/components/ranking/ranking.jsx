import NEWBIE from './../../assets/images/ranking/newbie.png';
import BRONZE from './../../assets/images/ranking/bronze.png';
import SILVER from './../../assets/images/ranking/silver.png';
import GOLD from './../../assets/images/ranking/gold.png';
import PLATINUM from './../../assets/images/ranking/platinum.png';
import DIAMOND from './../../assets/images/ranking/diamond.png';

const RankingIcon = ({ rank }) => {
  switch (rank) {
    case "bronze":
        return <img src={NEWBIE} alt='user-ranking' style={{ width: "20px", height: "20px" }}></img>;
    case "silver":
          return <img src={BRONZE} alt='user-ranking' style={{ width: "20px", height: "20px" }}></img>;
    case "gold":
          return <img src={SILVER} alt='user-ranking' style={{ width: "20px", height: "20px" }}></img>;
    case "platinum":
          return <img src={GOLD} alt='user-ranking' style={{ width: "20px", height: "20px" }}></img>;
    case "diamond":
          return <img src={PLATINUM} alt='user-ranking' style={{ width: "20px", height: "20px" }}></img>;
    case "vip":
        return <img src={DIAMOND} alt='user-ranking' style={{ width: "20px", height: "20px" }}></img>;
    default:
        break;
  }
};

export default RankingIcon;
import { useParams } from "react-router-dom";
import "./../styles/product-reviews.css";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import StarRating from "../components/star-rating/star-rating";
import RankingIcon from "../components/ranking/ranking";
import { showToast } from "../components/toasts/ToastNotification";
import { getProductReviewsBySlug } from "../api/review.api";
import { HashLoader } from "react-spinners";
import { userRankText } from "../utils";
import EMPTY_COMMENT from "./../assets/images/empty_comment.png";

export const ProductReviews = () => {
  const { product_slug } = useParams();
  const [selected, setSelected] = useState("all");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState(null);
  const [allReviews, setAllReviews] = useState(null);

  useEffect(() => {
    fetchProductReviews();
    document.title = "Đánh giá sản phẩm";
  }, [product_slug]);

  const fetchProductReviews = async () => {
    setLoading(true);
    try {
      const res = await getProductReviewsBySlug(product_slug, 50);
      if (res.success) {
        setReviews(res.data.product_reviews || null);
        setAllReviews(res.data.product_reviews || null);
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews =
    selected === "all"
      ? reviews?.reviews
      : reviews?.reviews.filter((rv) => rv.rating === parseInt(selected));

  if (loading) {
    return (
      <div style={{ height: "100vh" }} className="loader-container">
        <HashLoader color="#fff" />
      </div>
    );
  }

  return (
    <div className="product-all-reviews-container">
      <div className="all-reviews-container">
        <h2>Danh sách đánh giá</h2>
        <div className="reviews-category-container">
          <ReviewCategory number={"all"} setSelected={setSelected} selected={selected} />
          <ReviewCategory number={"5"} setSelected={setSelected} selected={selected} />
          <ReviewCategory number={"4"} setSelected={setSelected} selected={selected} />
          <ReviewCategory number={"3"} setSelected={setSelected} selected={selected} />
          <ReviewCategory number={"2"} setSelected={setSelected} selected={selected} />
          <ReviewCategory number={"1"} setSelected={setSelected} selected={selected} />
        </div>

        {Array.isArray(filteredReviews) && filteredReviews.length > 0 ? (
          <div className="review-item-container">
            {filteredReviews.map((review) => (
              <ReviewItem key={review?._id} review={review} />
            ))}
          </div>
        ) : (
          <div className="empty-comment-container">
            <img
              className="empty-comment-img"
              src={EMPTY_COMMENT}
              alt="Empty comment"
            />
            <p className="empty-comment-title">Chưa có đánh giá</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewCategory = ({ number, setSelected, selected }) => {
  return (
    <div
      onClick={() => setSelected(number)}
      className={`reviews-category-item ${
        selected === number ? "selected-category-reviews" : ""
      }`}
    >
      {number !== "all" ? (
        <>
          <p>{number}</p>
          <FaStar className="rating-icon" />
        </>
      ) : (
        <p>Tất cả</p>
      )}
    </div>
  );
};

const ReviewItem = ({ review }) => {
  return (
    <div className="review-item">
      <img
        className="review-item-user-avatar"
        src={review?.userId?.profileImg || "https://i.pravatar.cc/300"}
        alt="user-avatar"
      />
      <div className="review-item-user-info-container">
        <div className="review-item-username-rating">
          <p className="review-item-username">
            {review?.userId?.username || "Người dùng"}
          </p>
          <StarRating rating={review?.rating || 0} />
        </div>
        <div className="review-item-ranking-container">
          <RankingIcon rank={review?.userId?.rank || "diamond"} />
          <p className="user-rank-text">
            {userRankText(review?.userId?.rank) || ""}
          </p>
        </div>
        <div className="review-item-user-comment-container">
          <p className="user-comment">{review?.comment}</p>
          <p className="comment-date">
            {new Date(review?.createdAt).toLocaleDateString() || ""}
          </p>
        </div>
      </div>
    </div>
  );
};

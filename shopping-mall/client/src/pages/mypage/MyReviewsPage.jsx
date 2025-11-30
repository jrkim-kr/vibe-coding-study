import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import MyPageSidebar from "../../components/mypage/MyPageSidebar";
import "./MyPageLayout.css";
import "./MyReviewsPage.css";

function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      // TODO: 실제 API 연동
      // const response = await reviewAPI.getMyReviews();
      // setReviews(response.reviews || []);
      
      // 임시 데이터
      setReviews([]);
    } catch (error) {
      console.error("리뷰 목록 로드 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="mypage-layout-wrapper">
      <Header />
      <div className="mypage-container">
        <MyPageSidebar />
        <main className="mypage-content">
          <div className="mypage-main">
      <header className="mypage-main-header">
        <h2 className="mypage-main-title">리뷰 관리</h2>
        <p className="mypage-main-subtitle">
          작성한 리뷰를 확인하고 관리할 수 있습니다.
        </p>
      </header>

      <section className="mypage-main-content">
        {loading ? (
          <div className="mypage-empty">로딩 중...</div>
        ) : reviews.length === 0 ? (
          <div className="mypage-empty">
            작성한 리뷰가 없습니다.
            <p className="mypage-empty-desc">
              구매한 상품에 대한 리뷰를 작성해주세요.
            </p>
          </div>
        ) : (
          <ul className="mypage-reviews-list">
            {reviews.map((review) => (
              <li key={review._id} className="mypage-review-item">
                <div className="mypage-review-product">
                  <img
                    src={review.productImage || "https://via.placeholder.com/60"}
                    alt={review.productName || "상품"}
                    className="mypage-review-image"
                  />
                  <div className="mypage-review-product-info">
                    <div className="mypage-review-product-name">
                      {review.productName || "상품명"}
                    </div>
                    <div className="mypage-review-date">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="mypage-review-content">
                  <div className="mypage-review-rating">
                    {"⭐".repeat(review.rating || 0)}
                  </div>
                  <div className="mypage-review-text">
                    {review.content || "리뷰 내용"}
                  </div>
                  {review.images && review.images.length > 0 && (
                    <div className="mypage-review-images">
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`리뷰 이미지 ${idx + 1}`}
                          className="mypage-review-img"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="mypage-review-actions">
                  <button
                    type="button"
                    className="mypage-review-edit"
                    onClick={() => alert("리뷰 수정 기능은 추후 구현 예정입니다.")}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className="mypage-review-delete"
                    onClick={() => alert("리뷰 삭제 기능은 추후 구현 예정입니다.")}
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default MyReviewsPage;


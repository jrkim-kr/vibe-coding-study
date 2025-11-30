import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import MyPageSidebar from "../../components/mypage/MyPageSidebar";
import "./MyPageLayout.css";
import "./MyPage.css";

function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 사용자 정보
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <div className="mypage-layout-wrapper">
      <Header />
      <div className="mypage-container">
        <MyPageSidebar />
        <main className="mypage-content">
          <div className="mypage-main">
      <header className="mypage-main-header">
        <h2 className="mypage-main-title">마이페이지</h2>
        <p className="mypage-main-subtitle">
          {user?.name || "사용자"}님, 환영합니다!
        </p>
      </header>

      <section className="mypage-main-content">
        <div className="mypage-welcome-card">
          <div className="mypage-welcome-info">
            <h3 className="mypage-welcome-name">{user?.name || "사용자"}</h3>
            <p className="mypage-welcome-email">{user?.email || ""}</p>
          </div>
        </div>

        <div className="mypage-quick-links">
          <button
            type="button"
            className="mypage-quick-link"
            onClick={() => navigate("/mypage/orders")}
          >
            <div className="mypage-quick-link-icon">📦</div>
            <div className="mypage-quick-link-text">
              <div className="mypage-quick-link-title">주문 내역</div>
              <div className="mypage-quick-link-desc">주문 및 배송 조회</div>
            </div>
          </button>
          <button
            type="button"
            className="mypage-quick-link"
            onClick={() => navigate("/mypage/profile")}
          >
            <div className="mypage-quick-link-icon">👤</div>
            <div className="mypage-quick-link-text">
              <div className="mypage-quick-link-title">회원 정보</div>
              <div className="mypage-quick-link-desc">개인정보 수정</div>
            </div>
          </button>
          <button
            type="button"
            className="mypage-quick-link"
            onClick={() => navigate("/mypage/addresses")}
          >
            <div className="mypage-quick-link-icon">📍</div>
            <div className="mypage-quick-link-text">
              <div className="mypage-quick-link-title">배송지 관리</div>
              <div className="mypage-quick-link-desc">배송지 추가/수정</div>
            </div>
          </button>
          <button
            type="button"
            className="mypage-quick-link"
            onClick={() => navigate("/mypage/reviews")}
          >
            <div className="mypage-quick-link-icon">⭐</div>
            <div className="mypage-quick-link-text">
              <div className="mypage-quick-link-title">리뷰 관리</div>
              <div className="mypage-quick-link-desc">작성한 리뷰 보기</div>
            </div>
          </button>
        </div>
      </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default MyPage;

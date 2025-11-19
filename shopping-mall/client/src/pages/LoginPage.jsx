import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getSavedEmail = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("savedEmail") || "";
};

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const savedEmail = getSavedEmail();
    return {
      email: savedEmail,
      password: "",
      saveId: Boolean(savedEmail),
    };
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "이메일 또는 비밀번호가 일치하지 않습니다.");
        return;
      }

      // 토큰 및 사용자 정보 저장
      if (typeof window !== "undefined") {
        if (formData.saveId) {
          localStorage.setItem("savedEmail", formData.email);
        } else {
          localStorage.removeItem("savedEmail");
        }
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
      }

      setSuccess("로그인이 완료되었습니다.");
      setFormData((prev) => ({ ...prev, password: "" }));

      // 추후 대시보드 등으로 이동
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKakaoLogin = () => {
    // TODO: 카카오 로그인 구현
    alert("카카오 로그인 기능은 준비 중입니다.");
  };

  const handleNaverLogin = () => {
    // TODO: 네이버 로그인 구현
    alert("네이버 로그인 기능은 준비 중입니다.");
  };

  return (
    <div className="login-page">
      {/* 헤더 */}
      <header className="login-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="brand-name">LAROOM</h1>
        <button className="home-btn">🏠</button>
      </header>

      <main className="login-main">
        <h2 className="login-title">로그인</h2>
        <p className="login-subtitle">
          아이디와 비밀번호 입력하기 귀찮으시죠? 1초 회원가입으로 입력없이
          간편하게 로그인 하세요.
        </p>

        {/* 카카오 로그인 버튼 */}
        <button className="kakao-login-btn" onClick={handleKakaoLogin}>
          <span className="kakao-icon">💬</span>
          카카오 1초 로그인/회원가입
        </button>

        {/* 회원 혜택 섹션 */}
        <div className="benefits-section">
          <div className="benefit-item">
            <div className="benefit-icon">🎁</div>
            <div className="benefit-content">
              <div className="benefit-title">회원 가입 혜택</div>
              <div className="benefit-text">
                웰컴 쿠폰팩 54,000원 + 추가 적립금 2,000원
              </div>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">💎</div>
            <div className="benefit-content">
              <div className="benefit-title">멤버십 혜택</div>
              <div className="benefit-text">
                회원 특가, 무료배송&반품, 월별 등급별 쿠폰 지급
              </div>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">📄</div>
            <div className="benefit-content">
              <div className="benefit-title">프로모션 및 할인 알림</div>
              <div className="benefit-text">
                카카오 플러스 친구 추가하고 이벤트 소식 받기
              </div>
            </div>
          </div>
        </div>

        <div className="divider">또는</div>

        {/* 로그인 폼 */}
        <form className="login-form" onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <div className="input-group">
            <input
              type="text"
              name="email"
              placeholder="아이디"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
            />
          </div>
          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="saveId"
              checked={formData.saveId}
              onChange={handleChange}
            />
            <span>아이디저장</span>
          </label>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "기존 회원 로그인"}
          </button>
        </form>

        {/* 링크들 */}
        <div className="login-links">
          <Link to="/find-id">아이디 찾기</Link>
          <span>|</span>
          <Link to="/find-password">비밀번호 찾기</Link>
          <span>|</span>
          <Link to="/register">회원가입</Link>
        </div>

        <div className="divider">또는</div>

        {/* 네이버 로그인 */}
        <button className="naver-login-btn" onClick={handleNaverLogin}>
          <span className="naver-icon">N</span>
        </button>

        {/* 하단 정보 */}
        <div className="login-footer">
          <div className="footer-item">
            <span className="footer-icon">⚡</span>첫 구매가 빨라지는 1초
            회원가입
          </div>
          <div className="footer-item">
            <span className="footer-icon">ℹ️</span>
            살까 말까 고민하던 고객까지 막힘없이
          </div>
          <div className="footer-item">
            <span className="footer-icon">✓</span>
            LAROOM도 이미 1초 회원가입 사용 중
          </div>
        </div>
      </main>

      {/* Q&A 버튼 */}
      <button className="qa-button">Q&A</button>
    </div>
  );
}

export default LoginPage;

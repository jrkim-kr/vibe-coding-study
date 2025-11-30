import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./RegisterPage.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 해당 필드의 에러 제거
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = "이메일은 필수입니다.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요.";
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호는 필수입니다.";
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    // 비밀번호 확인 검증
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인은 필수입니다.";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    // 이름 검증
    if (!formData.name) {
      newErrors.name = "이름은 필수입니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        // 서버에서 반환한 에러 처리
        if (data.details) {
          setErrors(data.details);
        } else {
          setErrors({ submit: data.error || "회원가입에 실패했습니다." });
        }
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      setErrors({
        submit: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      {/* 헤더 */}
      <header className="register-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="brand-name">LAROOM</h1>
        <button className="home-btn">🏠</button>
      </header>

      <main className="register-main">
        <h2 className="register-title">회원가입</h2>
        <p className="register-subtitle">
          LAROOM에 오신 것을 환영합니다. 아래 정보를 입력해주세요.
        </p>

        <form className="register-form" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          {/* 이메일 */}
          <div className="form-group">
            <label className="form-label">
              이메일 <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              className={`form-input ${errors.email ? "error" : ""}`}
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="form-group">
            <label className="form-label">
              비밀번호 <span className="required">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8자 이상 입력하세요"
              className={`form-input ${errors.password ? "error" : ""}`}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-group">
            <label className="form-label">
              비밀번호 확인 <span className="required">*</span>
            </label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              className={`form-input ${errors.passwordConfirm ? "error" : ""}`}
            />
            {errors.passwordConfirm && (
              <span className="error-text">{errors.passwordConfirm}</span>
            )}
          </div>

          {/* 이름 */}
          <div className="form-group">
            <label className="form-label">
              이름 <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              className={`form-input ${errors.name ? "error" : ""}`}
            />
            {errors.name && (
              <span className="error-text">{errors.name}</span>
            )}
          </div>

          {/* 휴대폰 번호 */}
          <div className="form-group">
            <label className="form-label">휴대폰 번호</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-1234-5678 (선택사항)"
              className="form-input"
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="register-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "가입 중..." : "회원가입"}
          </button>
        </form>

        {/* 로그인 링크 */}
        <div className="register-footer">
          <span>이미 회원이신가요?</span>
          <Link to="/login" className="login-link">
            로그인
          </Link>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;


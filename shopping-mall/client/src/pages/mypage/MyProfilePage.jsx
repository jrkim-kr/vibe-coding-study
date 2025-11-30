import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import MyPageSidebar from "../../components/mypage/MyPageSidebar";
import { userAPI } from "../../utils/api";
import "./MyPageLayout.css";
import "./MyProfilePage.css";

function MyProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getMe();
        const userData = response.user;
        setUser(userData);
        setFormData({
          name: userData.name || "",
          phone: userData.phone || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("사용자 정보 조회 오류:", error);
        // 로컬스토리지에서 폴백
        const userStr = localStorage.getItem("currentUser");
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setFormData({
            name: userData.name || "",
            phone: userData.phone || "",
            email: userData.email || "",
          });
        } else {
          setErrors({
            submit: error.message || "사용자 정보를 불러올 수 없습니다.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    // 간단한 유효성 검사
    if (!formData.name.trim()) {
      setErrors({ name: "이름은 필수입니다." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await userAPI.updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      });

      // 업데이트된 사용자 정보로 상태 업데이트
      const updatedUser = response.user;
      setUser(updatedUser);

      // 로컬스토리지도 동기화
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      setSuccess("회원 정보가 수정되었습니다.");
    } catch (error) {
      console.error("회원 정보 수정 오류:", error);
      setErrors({
        submit: error.message || "회원 정보 수정 중 오류가 발생했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mypage-layout-wrapper">
        <Header />
        <div className="mypage-container">
          <MyPageSidebar />
          <main className="mypage-content">
            <div className="mypage-main">
              <header className="mypage-main-header">
                <h2 className="mypage-main-title">회원 정보</h2>
              </header>
              <section className="mypage-main-content">
                <p className="mypage-message">
                  사용자 정보를 불러오는 중입니다...
                </p>
              </section>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mypage-layout-wrapper">
      <Header />
      <div className="mypage-container">
        <MyPageSidebar />
        <main className="mypage-content">
          <div className="mypage-main">
            <header className="mypage-main-header">
              <h2 className="mypage-main-title">회원 정보</h2>
              <p className="mypage-main-subtitle">
                개인정보를 수정할 수 있습니다.
              </p>
            </header>

            <section className="mypage-main-content">
              <form className="mypage-profile-form" onSubmit={handleSubmit}>
                {errors.submit && (
                  <div className="mypage-error-message">{errors.submit}</div>
                )}
                {success && (
                  <div className="mypage-success-message">{success}</div>
                )}

                <div className="mypage-form-group">
                  <label className="mypage-form-label">
                    이메일 <span className="mypage-form-required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="mypage-form-input mypage-form-input-disabled"
                  />
                  <p className="mypage-form-help">
                    이메일은 변경할 수 없습니다.
                  </p>
                </div>

                <div className="mypage-form-group">
                  <label className="mypage-form-label">
                    이름 <span className="mypage-form-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mypage-form-input ${
                      errors.name ? "error" : ""
                    }`}
                    placeholder="이름을 입력하세요"
                  />
                  {errors.name && (
                    <span className="mypage-form-error">{errors.name}</span>
                  )}
                </div>

                <div className="mypage-form-group">
                  <label className="mypage-form-label">휴대폰 번호</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mypage-form-input"
                    placeholder="010-1234-5678"
                  />
                </div>

                <div className="mypage-form-actions">
                  <button
                    type="submit"
                    className="mypage-form-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "수정 중..." : "정보 수정"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default MyProfilePage;

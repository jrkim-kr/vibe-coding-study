import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import MyPageSidebar from "../../components/mypage/MyPageSidebar";
import "./MyPageLayout.css";
import "./MyAddressesPage.css";

function MyAddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    recipientName: "",
    phone: "",
    zipCode: "",
    address1: "",
    address2: "",
    memo: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      // TODO: 실제 API 연동
      // const response = await userAPI.getAddresses();
      // setAddresses(response.addresses || []);
      
      // 임시로 로컬스토리지에서 가져오기
      const userStr = localStorage.getItem("currentUser");
      if (userStr) {
        const user = JSON.parse(userStr);
        setAddresses(user.addresses || []);
      }
    } catch (error) {
      console.error("배송지 목록 로드 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // 유효성 검사
    if (!formData.recipientName.trim()) {
      setErrors({ recipientName: "수령인은 필수입니다." });
      return;
    }
    if (!formData.phone.trim()) {
      setErrors({ phone: "연락처는 필수입니다." });
      return;
    }
    if (!formData.zipCode.trim() || !formData.address1.trim()) {
      setErrors({ address1: "주소는 필수입니다." });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 실제 API 연동
      if (editingId) {
        // 수정
        // await userAPI.updateAddress(editingId, formData);
      } else {
        // 추가
        // await userAPI.addAddress(formData);
      }

      // 임시로 로컬스토리지 업데이트
      const userStr = localStorage.getItem("currentUser");
      if (userStr) {
        const user = JSON.parse(userStr);
        const userAddresses = user.addresses || [];
        
        if (editingId) {
          const updated = userAddresses.map((addr) =>
            addr._id === editingId ? { ...addr, ...formData } : addr
          );
          user.addresses = updated;
        } else {
          user.addresses = [
            ...userAddresses,
            { ...formData, _id: Date.now().toString() },
          ];
        }
        localStorage.setItem("currentUser", JSON.stringify(user));
      }

      await loadAddresses();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        recipientName: "",
        phone: "",
        zipCode: "",
        address1: "",
        address2: "",
        memo: "",
        isDefault: false,
      });
    } catch (error) {
      console.error("배송지 저장 오류:", error);
      setErrors({
        submit: error.message || "배송지 저장 중 오류가 발생했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      recipientName: address.recipientName || "",
      phone: address.phone || "",
      zipCode: address.zipCode || "",
      address1: address.address1 || "",
      address2: address.address2 || "",
      memo: address.memo || "",
      isDefault: address.isDefault || false,
    });
    setEditingId(address._id);
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("이 배송지를 삭제하시겠습니까?")) return;

    try {
      // TODO: 실제 API 연동
      // await userAPI.deleteAddress(addressId);

      // 임시로 로컬스토리지 업데이트
      const userStr = localStorage.getItem("currentUser");
      if (userStr) {
        const user = JSON.parse(userStr);
        user.addresses = (user.addresses || []).filter(
          (addr) => addr._id !== addressId
        );
        localStorage.setItem("currentUser", JSON.stringify(user));
      }

      await loadAddresses();
    } catch (error) {
      console.error("배송지 삭제 오류:", error);
      alert("배송지 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      recipientName: "",
      phone: "",
      zipCode: "",
      address1: "",
      address2: "",
      memo: "",
      isDefault: false,
    });
    setErrors({});
  };

  return (
    <div className="mypage-layout-wrapper">
      <Header />
      <div className="mypage-container">
        <MyPageSidebar />
        <main className="mypage-content">
          <div className="mypage-main">
      <header className="mypage-main-header">
        <h2 className="mypage-main-title">배송지 관리</h2>
        <p className="mypage-main-subtitle">
          배송지를 추가하고 관리할 수 있습니다.
        </p>
      </header>

      <section className="mypage-main-content">
        {!showForm ? (
          <>
            <div className="mypage-addresses-header">
              <button
                type="button"
                className="mypage-add-btn"
                onClick={() => setShowForm(true)}
              >
                + 배송지 추가
              </button>
            </div>

            {loading ? (
              <div className="mypage-empty">로딩 중...</div>
            ) : addresses.length === 0 ? (
              <div className="mypage-empty">
                등록된 배송지가 없습니다.
                <button
                  type="button"
                  className="mypage-empty-btn"
                  onClick={() => setShowForm(true)}
                >
                  배송지 추가하기
                </button>
              </div>
            ) : (
              <ul className="mypage-addresses-list">
                {addresses.map((address) => (
                  <li key={address._id} className="mypage-address-item">
                    <div className="mypage-address-content">
                      {address.isDefault && (
                        <span className="mypage-address-default">기본</span>
                      )}
                      <div className="mypage-address-info">
                        <div className="mypage-address-name">
                          {address.recipientName}
                        </div>
                        <div className="mypage-address-phone">
                          {address.phone}
                        </div>
                        <div className="mypage-address-addr">
                          ({address.zipCode}) {address.address1}{" "}
                          {address.address2}
                        </div>
                        {address.memo && (
                          <div className="mypage-address-memo">
                            배송 메모: {address.memo}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mypage-address-actions">
                      <button
                        type="button"
                        className="mypage-address-edit"
                        onClick={() => handleEdit(address)}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="mypage-address-delete"
                        onClick={() => handleDelete(address._id)}
                      >
                        삭제
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <form className="mypage-address-form" onSubmit={handleSubmit}>
            <h3 className="mypage-address-form-title">
              {editingId ? "배송지 수정" : "배송지 추가"}
            </h3>

            {errors.submit && (
              <div className="mypage-error-message">{errors.submit}</div>
            )}

            <div className="mypage-form-group">
              <label className="mypage-form-label">
                수령인 <span className="mypage-form-required">*</span>
              </label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                className={`mypage-form-input ${errors.recipientName ? "error" : ""}`}
                placeholder="수령인 이름"
              />
              {errors.recipientName && (
                <span className="mypage-form-error">{errors.recipientName}</span>
              )}
            </div>

            <div className="mypage-form-group">
              <label className="mypage-form-label">
                연락처 <span className="mypage-form-required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`mypage-form-input ${errors.phone ? "error" : ""}`}
                placeholder="010-1234-5678"
              />
              {errors.phone && (
                <span className="mypage-form-error">{errors.phone}</span>
              )}
            </div>

            <div className="mypage-form-group">
              <label className="mypage-form-label">
                주소 <span className="mypage-form-required">*</span>
              </label>
              <div className="mypage-address-zip-group">
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="mypage-form-input"
                  placeholder="우편번호"
                  readOnly
                />
                <button
                  type="button"
                  className="mypage-address-zip-btn"
                  onClick={() => alert("주소 검색 기능은 추후 구현 예정입니다.")}
                >
                  주소 검색
                </button>
              </div>
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                className={`mypage-form-input ${errors.address1 ? "error" : ""}`}
                placeholder="기본 주소"
                readOnly
                style={{ marginTop: "8px" }}
              />
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                className="mypage-form-input"
                placeholder="상세 주소"
                style={{ marginTop: "8px" }}
              />
              {errors.address1 && (
                <span className="mypage-form-error">{errors.address1}</span>
              )}
            </div>

            <div className="mypage-form-group">
              <label className="mypage-form-label">배송 메모</label>
              <input
                type="text"
                name="memo"
                value={formData.memo}
                onChange={handleChange}
                className="mypage-form-input"
                placeholder="배송 시 요청사항 (선택사항)"
              />
            </div>

            <div className="mypage-form-group">
              <label className="mypage-form-checkbox">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                />
                <span>기본 배송지로 설정</span>
              </label>
            </div>

            <div className="mypage-form-actions">
              <button
                type="button"
                className="mypage-form-cancel"
                onClick={handleCancel}
              >
                취소
              </button>
              <button
                type="submit"
                className="mypage-form-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        )}
      </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default MyAddressesPage;


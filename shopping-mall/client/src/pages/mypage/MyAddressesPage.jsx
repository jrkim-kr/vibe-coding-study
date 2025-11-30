import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import MyPageSidebar from "../../components/mypage/MyPageSidebar";
import { userAPI } from "../../utils/api";
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

    // 다음 우편번호 API 스크립트 로드
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      const existingScript = document.querySelector(
        'script[src*="postcode.v2.js"]'
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAddresses();
      setAddresses(response.addresses || []);
    } catch (error) {
      console.error("배송지 목록 로드 오류:", error);
      // 폴백: 로컬스토리지에서 가져오기
      const userStr = localStorage.getItem("currentUser");
      if (userStr) {
        const user = JSON.parse(userStr);
        setAddresses(user.addresses || []);
      }
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
      if (editingId) {
        // 수정
        await userAPI.updateAddress(editingId, formData);
      } else {
        // 추가
        await userAPI.addAddress(formData);
      }

      // 성공 후 목록 새로고침
      await loadAddresses();

      // 사용자 정보도 업데이트 (로컬스토리지 동기화)
      try {
        const userResponse = await userAPI.getMe();
        localStorage.setItem("currentUser", JSON.stringify(userResponse.user));
      } catch (err) {
        console.warn("사용자 정보 동기화 실패:", err);
      }

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
      await userAPI.deleteAddress(addressId);

      // 성공 후 목록 새로고침
      await loadAddresses();

      // 사용자 정보도 업데이트 (로컬스토리지 동기화)
      try {
        const userResponse = await userAPI.getMe();
        localStorage.setItem("currentUser", JSON.stringify(userResponse.user));
      } catch (err) {
        console.warn("사용자 정보 동기화 실패:", err);
      }
    } catch (error) {
      console.error("배송지 삭제 오류:", error);
      alert(error.message || "배송지 삭제 중 오류가 발생했습니다.");
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

  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드
          let addr = ""; // 주소 변수
          let extraAddr = ""; // 참고항목 변수

          // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
          if (data.userSelectedType === "R") {
            // 도로명 주소를 선택했을 경우
            addr = data.roadAddress;
          } else {
            // 지번 주소를 선택했을 경우(J)
            addr = data.jibunAddress;
          }

          // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
          if (data.userSelectedType === "R") {
            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if (data.buildingName !== "" && data.apartment === "Y") {
              extraAddr +=
                extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if (extraAddr !== "") {
              extraAddr = " (" + extraAddr + ")";
            }
          }

          // 우편번호와 주소 정보를 해당 필드에 넣는다.
          setFormData((prev) => ({
            ...prev,
            zipCode: data.zonecode,
            address1: addr + extraAddr,
          }));
        },
        width: "100%",
        height: "100%",
      }).open();
    } else {
      alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
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
                              <span className="mypage-address-default">
                                기본
                              </span>
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
                      className={`mypage-form-input ${
                        errors.recipientName ? "error" : ""
                      }`}
                      placeholder="수령인 이름"
                    />
                    {errors.recipientName && (
                      <span className="mypage-form-error">
                        {errors.recipientName}
                      </span>
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
                      className={`mypage-form-input ${
                        errors.phone ? "error" : ""
                      }`}
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
                      />
                      <button
                        type="button"
                        className="mypage-address-zip-btn"
                        onClick={handleAddressSearch}
                      >
                        주소 검색
                      </button>
                    </div>
                    <input
                      type="text"
                      name="address1"
                      value={formData.address1}
                      onChange={handleChange}
                      className={`mypage-form-input ${
                        errors.address1 ? "error" : ""
                      }`}
                      placeholder="기본 주소"
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
                      <span className="mypage-form-error">
                        {errors.address1}
                      </span>
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

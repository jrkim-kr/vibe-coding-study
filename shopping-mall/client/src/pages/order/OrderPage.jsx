import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { userOrderAPI, cartAPI, paymentAPI, userAPI } from "../../utils/api";
import { clearCart as clearLocalCart } from "../../utils/cart";
import "./OrderPage.css";

function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const items = Array.isArray(location.state?.items)
    ? location.state.items
    : [];

  const [shipping, setShipping] = useState({
    recipientName: "",
    phone: "",
    zipCode: "",
    address1: "",
    address2: "",
    memo: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);

  // 포트원 결제 모듈 초기화 및 배송지 목록 로드
  useEffect(() => {
    const { IMP } = window;
    if (IMP) {
      IMP.init("imp47103540");
    }

    // 배송지 목록 로드
    const loadAddresses = async () => {
      try {
        const response = await userAPI.getAddresses();
        const addressList = response.addresses || [];
        setAddresses(addressList);

        // 기본 배송지가 있으면 자동 선택
        const defaultAddress = addressList.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
          setUseSavedAddress(true);
          setShipping({
            recipientName: defaultAddress.recipientName || "",
            phone: defaultAddress.phone || "",
            zipCode: defaultAddress.zipCode || "",
            address1: defaultAddress.address1 || "",
            address2: defaultAddress.address2 || "",
            memo: defaultAddress.memo || "",
          });
        } else if (addressList.length > 0) {
          // 기본 배송지가 없으면 첫 번째 배송지 선택
          setSelectedAddressId(addressList[0]._id);
          setUseSavedAddress(true);
          setShipping({
            recipientName: addressList[0].recipientName || "",
            phone: addressList[0].phone || "",
            zipCode: addressList[0].zipCode || "",
            address1: addressList[0].address1 || "",
            address2: addressList[0].address2 || "",
            memo: addressList[0].memo || "",
          });
        }
      } catch (error) {
        console.error("배송지 목록 로드 오류:", error);
      }
    };

    loadAddresses();
  }, []);

  const { productsTotal, shippingFee, discountTotal, paymentTotal, totalQty } =
    useMemo(() => {
      const productsTotalCalc = items.reduce(
        (sum, item) => sum + item.price * (item.quantity || 0),
        0
      );
      const totalQtyCalc = items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );

      const shippingFeeCalc = 0; // MVP: 무료 배송
      const discountTotalCalc = 0; // MVP: 할인 없음

      return {
        productsTotal: productsTotalCalc,
        shippingFee: shippingFeeCalc,
        discountTotal: discountTotalCalc,
        paymentTotal: productsTotalCalc + shippingFeeCalc - discountTotalCalc,
        totalQty: totalQtyCalc,
      };
    }, [items]);

  const handleChangeShipping = (field, value) => {
    setShipping((prev) => ({
      ...prev,
      [field]: value,
    }));
    // 수동 입력 시 저장된 배송지 선택 해제
    if (useSavedAddress) {
      setUseSavedAddress(false);
      setSelectedAddressId("");
    }
  };

  const handleSelectAddress = (addressId) => {
    const address = addresses.find((addr) => addr._id === addressId);
    if (address) {
      setSelectedAddressId(addressId);
      setUseSavedAddress(true);
      setShipping({
        recipientName: address.recipientName || "",
        phone: address.phone || "",
        zipCode: address.zipCode || "",
        address1: address.address1 || "",
        address2: address.address2 || "",
        memo: address.memo || "",
      });
    }
  };

  const handleUseNewAddress = () => {
    setUseSavedAddress(false);
    setSelectedAddressId("");
    setShipping({
      recipientName: "",
      phone: "",
      zipCode: "",
      address1: "",
      address2: "",
      memo: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!items.length) {
      alert("주문할 상품 정보가 없습니다. 장바구니에서 다시 시도해주세요.");
      navigate("/cart");
      return;
    }

    if (!shipping.recipientName || !shipping.phone || !shipping.address1) {
      alert("수령인, 연락처, 주소는 필수 입력입니다.");
      return;
    }

    // 카드 결제인 경우 포트원 결제 요청
    if (paymentMethod === "card") {
      const { IMP } = window;
      if (!IMP) {
        alert("결제 모듈을 불러올 수 없습니다. 페이지를 새로고침해주세요.");
        return;
      }

      const selectedProductIds = items.map((item) => item.productId);
      const merchantUid = `order_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // 포트원 결제 요청
      // 테스트 모드에서는 pg 파라미터를 명시적으로 지정하는 것이 안전합니다
      IMP.request_pay(
        {
          pg: "html5_inicis", // KG이니시스 (테스트 모드에서도 동일)
          pay_method: "card",
          merchant_uid: merchantUid,
          name:
            items.length === 1
              ? items[0].name
              : `${items[0].name} 외 ${items.length - 1}개`,
          amount: paymentTotal,
          buyer_name: shipping.recipientName,
          buyer_tel: shipping.phone,
          buyer_email: "", // 이메일은 선택사항
        },
        async (rsp) => {
          try {
            setSubmitting(true);

            if (rsp.success) {
              // 결제 성공 - 서버에서 결제 검증
              const verifyResult = await paymentAPI.verifyPayment(rsp.imp_uid);

              if (!verifyResult.success) {
                throw new Error("결제 검증에 실패했습니다.");
              }

              // 결제 검증 성공 후 주문 생성
              const result = await userOrderAPI.createOrderFromCart({
                shipping,
                paymentMethod,
                selectedProductIds,
                impUid: rsp.imp_uid,
                merchantUid: merchantUid,
              });

              // 서버 장바구니 비우기
              try {
                await cartAPI.clearCart();
              } catch (clearError) {
                console.warn(
                  "서버 장바구니 비우기 실패 (무시 가능):",
                  clearError
                );
              }
              clearLocalCart();

              const orderId = result.order?._id;

              navigate(
                orderId
                  ? `/order/complete/${orderId}`
                  : "/order/complete/unknown",
                {
                  state: {
                    orderNumber: result.order?.orderNumber,
                    paymentTotal,
                  },
                }
              );
            } else {
              // 결제 실패
              let errorMessage = rsp.error_msg || "알 수 없는 오류";

              // 에러 코드에 따른 안내 메시지
              if (rsp.error_code) {
                const errorCode = rsp.error_code;

                // PG사 설정 관련 오류
                if (
                  errorCode === "F0004" ||
                  errorMessage.includes("사업자번호")
                ) {
                  errorMessage = `결제 설정 오류: 포트원 대시보드에서 KG이니시스 채널 설정을 확인해주세요.\n\n[테스트 모드인 경우]\n1. 결제 연동 → 테스트 → KG이니시스 채널 설정 확인\n2. 웹표준결제 signkey가 설정되어 있는지 확인\n   (필수 값: SU5JTElURV9UUklQTEVERVNfS0VZU1RS)\n3. PG상점아이디(MID)가 "INIpayTest"로 설정되어 있는지 확인\n\n[실연동 모드인 경우]\n1. 실제 MID, 사업자번호, 비밀번호가 올바르게 입력되었는지 확인\n\n원본 에러: ${errorMessage}`;
                } else if (errorCode === "F0001") {
                  errorMessage = `결제 모듈 오류: 포트원 결제 모듈 초기화를 확인해주세요.\n\n에러: ${errorMessage}`;
                } else if (errorCode === "F0002") {
                  errorMessage = `결제 정보 오류: 결제 정보를 확인해주세요.\n\n에러: ${errorMessage}`;
                }
              }

              console.error("결제 실패 상세:", {
                success: rsp.success,
                error_code: rsp.error_code,
                error_msg: rsp.error_msg,
                imp_uid: rsp.imp_uid,
                merchant_uid: rsp.merchant_uid,
              });

              alert(`결제에 실패했습니다:\n\n${errorMessage}`);
              setSubmitting(false);
            }
          } catch (error) {
            console.error("결제 처리 실패:", error);
            alert(error.message || "결제 처리 중 오류가 발생했습니다.");
            setSubmitting(false);
          }
        }
      );
    } else {
      // 카드 외 결제 수단 (현재는 미지원)
      alert("현재 신용/체크카드 결제만 지원됩니다.");
    }
  };

  if (!items.length) {
    return (
      <div className="order-page">
        <Header />
        <main className="order-main">
          <header className="order-header">
            <h2 className="order-title">ORDER SHEET</h2>
            <p className="order-subtitle">
              주문할 상품 정보가 없습니다. 장바구니에서 다시 시도해주세요.
            </p>
          </header>
          <section className="order-empty">
            <button
              type="button"
              className="order-empty-btn"
              onClick={() => navigate("/cart")}
            >
              장바구니로 이동
            </button>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="order-page">
      <Header />

      <main className="order-main">
        <header className="order-header">
          <h2 className="order-title">ORDER SHEET</h2>
          <p className="order-subtitle">
            배송지 정보를 입력하고 결제 수단을 선택한 뒤 주문을 완료하세요.
          </p>
        </header>

        <section className="order-content">
          <form className="order-form" onSubmit={handleSubmit}>
            <section className="order-section">
              <h3 className="order-section-title">DELIVERY</h3>
              <div className="order-section-body">
                {addresses.length > 0 && (
                  <div className="order-field">
                    <span className="order-field-label">배송지 선택</span>
                    <div className="order-address-select-group">
                      <select
                        value={useSavedAddress ? selectedAddressId : ""}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleSelectAddress(e.target.value);
                          } else {
                            handleUseNewAddress();
                          }
                        }}
                        className="order-address-select"
                      >
                        <option value="">새 배송지 입력</option>
                        {addresses.map((address) => (
                          <option key={address._id} value={address._id}>
                            {address.isDefault && "[기본] "}
                            {address.recipientName} - {address.address1}
                            {address.address2 ? ` ${address.address2}` : ""}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="order-address-manage-btn"
                        onClick={() => navigate("/mypage/addresses")}
                      >
                        배송지 관리
                      </button>
                    </div>
                  </div>
                )}

                <div className="order-field-row">
                  <label className="order-field">
                    <span className="order-field-label required">
                      수령인 이름
                    </span>
                    <input
                      type="text"
                      value={shipping.recipientName}
                      onChange={(e) =>
                        handleChangeShipping("recipientName", e.target.value)
                      }
                      placeholder="홍길동"
                    />
                  </label>
                  <label className="order-field">
                    <span className="order-field-label required">연락처</span>
                    <input
                      type="tel"
                      value={shipping.phone}
                      onChange={(e) =>
                        handleChangeShipping("phone", e.target.value)
                      }
                      placeholder="010-1234-5678"
                    />
                  </label>
                </div>

                <div className="order-field-row">
                  <label className="order-field order-field-zip">
                    <span className="order-field-label required">우편번호</span>
                    <div className="order-zip-group">
                      <input
                        type="text"
                        value={shipping.zipCode}
                        onChange={(e) =>
                          handleChangeShipping("zipCode", e.target.value)
                        }
                        placeholder="우편번호"
                      />
                      <button
                        type="button"
                        className="order-zip-btn"
                        onClick={() =>
                          alert("주소 검색 기능은 추후 연동 예정입니다.")
                        }
                      >
                        주소 검색
                      </button>
                    </div>
                  </label>
                </div>

                <label className="order-field">
                  <span className="order-field-label required">주소</span>
                  <input
                    type="text"
                    value={shipping.address1}
                    onChange={(e) =>
                      handleChangeShipping("address1", e.target.value)
                    }
                    placeholder="기본 주소"
                  />
                </label>

                <label className="order-field">
                  <span className="order-field-label">상세 주소</span>
                  <input
                    type="text"
                    value={shipping.address2}
                    onChange={(e) =>
                      handleChangeShipping("address2", e.target.value)
                    }
                    placeholder="동/호수 등 상세 주소"
                  />
                </label>

                <label className="order-field">
                  <span className="order-field-label">배송 메모</span>
                  <textarea
                    rows={3}
                    value={shipping.memo}
                    onChange={(e) =>
                      handleChangeShipping("memo", e.target.value)
                    }
                    placeholder="부재 시 경비실에 맡겨주세요 등"
                  />
                </label>
              </div>
            </section>

            <section className="order-section">
              <h3 className="order-section-title">PAYMENT</h3>
              <div className="order-section-body">
                <div className="order-field">
                  <span className="order-field-label required">결제 수단</span>
                  <div className="order-payment-options">
                    <label className="order-radio">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>신용/체크카드</span>
                    </label>
                    <label className="order-radio order-radio-disabled">
                      <input type="radio" name="paymentMethod" disabled />
                      <span>무통장입금 (추후 지원)</span>
                    </label>
                  </div>
                  <p className="order-help-text">
                    실제 PG 결제 연동 전까지는 결제 테스트용 모달/알림으로
                    처리됩니다.
                  </p>
                </div>
              </div>
            </section>

            <section className="order-section order-items-section">
              <h3 className="order-section-title">ITEMS</h3>
              <div className="order-section-body order-items-list">
                {items.map((item) => (
                  <article key={item.productId} className="order-item-row">
                    <div className="order-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="order-item-info">
                      <h4 className="order-item-name">{item.name}</h4>
                      <p className="order-item-meta">
                        수량 {item.quantity}개 · ₩ {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="order-item-total">
                      ₩ {(item.price * (item.quantity || 0)).toLocaleString()}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </form>

          <aside className="order-summary">
            <h3 className="order-summary-title">ORDER SUMMARY</h3>
            <div className="order-summary-row">
              <span>상품 수량</span>
              <span>{totalQty}개</span>
            </div>
            <div className="order-summary-row">
              <span>상품 금액</span>
              <span>₩ {productsTotal.toLocaleString()}</span>
            </div>
            <div className="order-summary-row">
              <span>배송비</span>
              <span>₩ {shippingFee.toLocaleString()}</span>
            </div>
            <div className="order-summary-row">
              <span>할인 금액</span>
              <span>- ₩ {discountTotal.toLocaleString()}</span>
            </div>
            <div className="order-summary-divider" />
            <div className="order-summary-row order-summary-total">
              <span>TOTAL</span>
              <span>₩ {paymentTotal.toLocaleString()}</span>
            </div>

            <button
              type="button"
              className="order-back-btn"
              onClick={() => navigate("/cart")}
            >
              장바구니로 돌아가기
            </button>
            <button
              type="submit"
              className="order-submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "결제 처리 중..." : "결제하기"}
            </button>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default OrderPage;

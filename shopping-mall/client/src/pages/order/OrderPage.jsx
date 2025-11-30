import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { userOrderAPI, cartAPI } from "../../utils/api";
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

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);

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
  };

  const handleSubmit = (e) => {
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

    const selectedProductIds = items.map((item) => item.productId);

    const submitOrder = async () => {
      try {
        setSubmitting(true);

        const result = await userOrderAPI.createOrderFromCart({
          shipping,
          paymentMethod,
          selectedProductIds,
        });

        // 서버 장바구니 비우기 (주문된 상품만 제거되지만, 클라이언트 로컬 장바구니도 정리)
        try {
          await cartAPI.clearCart();
        } catch (clearError) {
          console.warn("서버 장바구니 비우기 실패 (무시 가능):", clearError);
        }
        clearLocalCart();

        const orderId = result.order?._id;

        navigate(
          orderId ? `/order/complete/${orderId}` : "/order/complete/unknown",
          {
            state: {
              orderNumber: result.order?.orderNumber,
              paymentTotal,
            },
          }
        );
      } catch (error) {
        console.error("주문 생성 실패:", error);
        alert(error.message || "주문을 생성하는 중 오류가 발생했습니다.");
      } finally {
        setSubmitting(false);
      }
    };

    submitOrder();
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
      <MainHeader />

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
                  <article
                    key={item.productId}
                    className="order-item-row"
                  >
                    <div className="order-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="order-item-info">
                      <h4 className="order-item-name">{item.name}</h4>
                      <p className="order-item-meta">
                        수량 {item.quantity}개 · ₩{" "}
                        {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="order-item-total">
                      ₩{" "}
                      {(item.price * (item.quantity || 0)).toLocaleString()}
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



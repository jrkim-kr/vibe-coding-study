import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import {
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  setCartItems,
} from "../utils/cart";
import { cartAPI } from "../utils/api";
import "./MainPage.css";
import "./CartPage.css";

function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        // 서버 장바구니 우선 시도
        const serverCart = await cartAPI.getCart();
        if (serverCart && Array.isArray(serverCart.items)) {
          setItems(serverCart.items);
          setSelectedIds(serverCart.items.map((item) => item.productId));
          // 서버 장바구니를 기준으로 로컬 장바구니도 동기화
          setCartItems(serverCart.items);
          return;
        }
      } catch (error) {
        console.warn("서버 장바구니 조회 실패, 로컬 장바구니 사용:", error);
      }

      // 서버 실패 시 로컬 장바구니 사용
      const loaded = getCartItems();
      setItems(loaded);
      setSelectedIds(loaded.map((item) => item.productId));
    };

    init();
  }, []);

  const handleChangeQuantity = async (productId, delta) => {
    const currentItem = items.find((item) => item.productId === productId);
    if (!currentItem) return;

    const nextQty = (currentItem.quantity || 1) + delta;
    if (nextQty < 1) return;

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: nextQty } : item
      )
    );

    try {
      await cartAPI.updateItemQuantity(productId, nextQty);
    } catch (error) {
      console.error("서버 장바구니 수량 변경 오류:", error);
    }

    // 로컬 장바구니도 동기화
    const updated = updateCartItemQuantity(productId, nextQty);
    setItems(updated);
  };

  const handleRemove = async (productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    setSelectedIds((prev) => prev.filter((id) => id !== productId));

    try {
      await cartAPI.removeItem(productId);
    } catch (error) {
      console.error("서버 장바구니 상품 삭제 오류:", error);
    }

    const updated = removeCartItem(productId);
    setItems(updated);
  };

  const handleClear = async () => {
    if (!window.confirm("장바구니를 모두 비우시겠습니까?")) return;
    setItems([]);
    setSelectedIds([]);

    try {
      await cartAPI.clearCart();
    } catch (error) {
      console.error("서버 장바구니 비우기 오류:", error);
    }

    clearCart();
  };

  const handleToggleItem = (productId) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.productId));
    }
  };

  const selectedItems = items.filter((item) =>
    selectedIds.includes(item.productId)
  );

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 0),
    0
  );

  const totalQuantity = selectedItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const handleOrder = () => {
    if (selectedItems.length === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }
    alert(
      `선택된 ${totalQuantity}개 상품을 기준으로 주문 기능은 추후 구현 예정입니다.`
    );
  };

  return (
    <div className="cart-page">
      <MainHeader />

      <main className="cart-main">
        <header className="cart-header">
          <h2 className="cart-title">SHOPPING CART</h2>
          <p className="cart-subtitle">
            선택한 상품을 확인하고 수량을 조정한 뒤 주문을 진행하세요.
          </p>
        </header>

        {items.length === 0 ? (
          <section className="cart-empty">
            <p className="cart-empty-text">장바구니에 담긴 상품이 없습니다.</p>
            <button
              type="button"
              className="cart-empty-btn"
              onClick={() => navigate("/")}
            >
              쇼핑 계속하기
            </button>
          </section>
        ) : (
          <section className="cart-content">
            <div className="cart-items">
              <div className="cart-items-header">
                <label className="cart-select-all">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleToggleAll}
                  />
                  <span>전체 선택</span>
                </label>
                <span className="cart-selected-info">
                  선택된 상품 {selectedItems.length}개
                </span>
              </div>
              {items.map((item) => (
                <article key={item.productId} className="cart-item">
                  <div className="cart-item-select">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.productId)}
                      onChange={() => handleToggleItem(item.productId)}
                    />
                  </div>
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">
                      ₩ {item.price.toLocaleString()}
                    </p>
                    {typeof item.stock === "number" && item.stock >= 0 && (
                      <p className="cart-item-stock">재고: {item.stock}개</p>
                    )}
                    <div className="cart-item-actions">
                      <div className="cart-qty-control">
                        <button
                          type="button"
                          onClick={() =>
                            handleChangeQuantity(item.productId, -1)
                          }
                          disabled={(item.quantity || 1) <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleChangeQuantity(item.productId, 1)
                          }
                          disabled={
                            typeof item.stock === "number" &&
                            item.stock >= 0 &&
                            (item.quantity || 1) >= item.stock
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => handleRemove(item.productId)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    <span className="cart-item-total-label">합계</span>
                    <span className="cart-item-total-value">
                      ₩ {(item.price * (item.quantity || 0)).toLocaleString()}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-summary">
              <h3 className="cart-summary-title">ORDER SUMMARY</h3>
              <div className="cart-summary-row">
                <span>상품 수량</span>
                <span>{totalQuantity}개</span>
              </div>
              <div className="cart-summary-row">
                <span>상품 금액</span>
                <span>₩ {subtotal.toLocaleString()}</span>
              </div>
              <div className="cart-summary-row">
                <span>배송비</span>
                <span>₩ 0</span>
              </div>
              <div className="cart-summary-divider" />
              <div className="cart-summary-row cart-summary-total">
                <span>TOTAL</span>
                <span>₩ {subtotal.toLocaleString()}</span>
              </div>

              <button
                type="button"
                className="cart-order-btn"
                onClick={handleOrder}
                disabled={selectedItems.length === 0}
              >
                주문하기
              </button>

              <button
                type="button"
                className="cart-clear-btn"
                onClick={handleClear}
              >
                장바구니 비우기
              </button>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}

export default CartPage;

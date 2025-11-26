// 장바구니 로컬 스토리지 유틸
const CART_KEY = "cartItems";
const CART_EVENT = "cart:updated";

const emitCartUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CART_EVENT));
};

export const getCartItems = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error("장바구니 데이터 파싱 오류:", e);
    return [];
  }
};

const saveCartItems = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    emitCartUpdated();
  } catch (e) {
    console.error("장바구니 저장 오류:", e);
  }
};

export const addToCart = (product, quantity = 1) => {
  if (!product || (!product._id && !product.id)) return;

  const id = product._id || product.id;
  const price =
    typeof product.price === "number"
      ? product.price
      : parseInt(product.price ?? "0", 10) || 0;

  const items = getCartItems();
  const existingIndex = items.findIndex((item) => item.productId === id);

  if (existingIndex >= 0) {
    const nextQty = items[existingIndex].quantity + quantity;
    items[existingIndex].quantity = nextQty < 1 ? 1 : nextQty;
  } else {
    items.push({
      productId: id,
      name: product.name,
      image:
        (Array.isArray(product.images) && product.images[0]) ||
        product.image ||
        "https://via.placeholder.com/120x120?text=Product",
      price,
      quantity: quantity < 1 ? 1 : quantity,
      stock:
        typeof product.stock === "number" && product.stock >= 0
          ? product.stock
          : null,
    });
  }

  saveCartItems(items);
  return items;
};

export const updateCartItemQuantity = (productId, quantity) => {
  const items = getCartItems();
  const next = items.map((item) => {
    if (item.productId !== productId) return item;
    let nextQty = quantity;
    if (nextQty < 1) nextQty = 1;
    if (typeof item.stock === "number" && item.stock >= 0) {
      if (nextQty > item.stock) nextQty = item.stock;
    }
    return { ...item, quantity: nextQty };
  });
  saveCartItems(next);
  return next;
};

export const removeCartItem = (productId) => {
  const items = getCartItems();
  const next = items.filter((item) => item.productId !== productId);
  saveCartItems(next);
  return next;
};

export const clearCart = () => {
  saveCartItems([]);
};

export const getCartCount = () => {
  const items = getCartItems();
  return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
};

export const CART_UPDATED_EVENT = CART_EVENT;

// 서버 장바구니 등 외부 데이터로 로컬 장바구니를 덮어쓸 때 사용
export const setCartItems = (items) => {
  if (!Array.isArray(items)) {
    saveCartItems([]);
  } else {
    saveCartItems(items);
  }
};



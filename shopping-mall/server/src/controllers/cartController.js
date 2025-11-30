import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import {
  asyncHandler,
  sendSuccess,
  sendError,
  sendNotFound,
  sendBadRequest,
} from "../utils/responseHelpers.js";

// 현재 로그인한 사용자의 장바구니 조회
export const getMyCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId })
    .populate("items.productId", "name images price stock status")
    .lean();

  if (!cart) {
    return res.json({
      items: [],
      totalQuantity: 0,
      subtotal: 0,
    });
  }

  const items = cart.items.map((item) => {
    const product = item.productId;
    return {
      _id: item._id,
      productId: product?._id || item.productId,
      name: product?.name || "",
      image:
        (product?.images && product.images[0]) ||
        "https://via.placeholder.com/120x120?text=Product",
      price: product?.price ?? item.priceAtAdded ?? 0,
      quantity: item.quantity,
      stock: typeof product?.stock === "number" ? product.stock : null,
      status: product?.status || "onSale",
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  sendSuccess(res, {
    items,
    totalQuantity,
    subtotal,
  });
});

// 장바구니에 상품 추가 또는 수량 증가
export const addOrUpdateItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return sendBadRequest(res, "productId는 필수입니다.");
  }
  const qty = parseInt(quantity, 10);
  if (Number.isNaN(qty) || qty <= 0) {
    return sendBadRequest(res, "수량은 1 이상이어야 합니다.");
  }

  const product = await Product.findById(productId);
  if (!product) {
    return sendNotFound(res, "상품");
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({
      userId,
      items: [],
    });
  }

  const existing = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existing) {
    existing.quantity += qty;
    if (existing.quantity < 1) existing.quantity = 1;
  } else {
    cart.items.push({
      productId,
      quantity: qty,
      priceAtAdded: product.price ?? 0,
    });
  }

  await cart.save();

  return getMyCart(req, res);
});

// 특정 상품 수량 변경
export const updateItemQuantity = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  const qty = parseInt(quantity, 10);
  if (Number.isNaN(qty) || qty <= 0) {
    return sendBadRequest(res, "수량은 1 이상이어야 합니다.");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return sendNotFound(res, "장바구니");
  }

  const item = cart.items.find((i) => i.productId.toString() === productId);
  if (!item) {
    return sendNotFound(res, "장바구니 상품");
  }

  item.quantity = qty;
  await cart.save();

  return getMyCart(req, res);
});

// 장바구니에서 상품 제거
export const removeItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return sendNotFound(res, "장바구니");
  }

  cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
  await cart.save();

  return getMyCart(req, res);
});

// 장바구니 비우기
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return sendSuccess(res, {
      items: [],
      totalQuantity: 0,
      subtotal: 0,
    });
  }

  cart.items = [];
  await cart.save();

  return getMyCart(req, res);
});

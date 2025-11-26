import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// 현재 로그인한 사용자의 장바구니 조회
export const getMyCart = async (req, res) => {
  try {
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

    const subtotal = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

    res.json({
      items,
      totalQuantity,
      subtotal,
    });
  } catch (error) {
    console.error("장바구니 조회 오류:", error);
    res.status(500).json({
      error: "장바구니를 불러오는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

// 장바구니에 상품 추가 또는 수량 증가
export const addOrUpdateItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId는 필수입니다." });
    }
    const qty = parseInt(quantity, 10);
    if (Number.isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: "수량은 1 이상이어야 합니다." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
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
  } catch (error) {
    console.error("장바구니 추가/수정 오류:", error);
    res.status(500).json({
      error: "장바구니에 상품을 추가하는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

// 특정 상품 수량 변경
export const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);
    if (Number.isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: "수량은 1 이상이어야 합니다." });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "장바구니가 없습니다." });
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );
    if (!item) {
      return res
        .status(404)
        .json({ error: "장바구니에 해당 상품이 없습니다." });
    }

    item.quantity = qty;
    await cart.save();

    return getMyCart(req, res);
  } catch (error) {
    console.error("장바구니 수량 변경 오류:", error);
    res.status(500).json({
      error: "장바구니 수량을 변경하는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

// 장바구니에서 상품 제거
export const removeItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "장바구니가 없습니다." });
    }

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );
    await cart.save();

    return getMyCart(req, res);
  } catch (error) {
    console.error("장바구니 상품 제거 오류:", error);
    res.status(500).json({
      error: "장바구니에서 상품을 제거하는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

// 장바구니 비우기
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.json({
        items: [],
        totalQuantity: 0,
        subtotal: 0,
      });
    }

    cart.items = [];
    await cart.save();

    return getMyCart(req, res);
  } catch (error) {
    console.error("장바구니 비우기 오류:", error);
    res.status(500).json({
      error: "장바구니를 비우는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};



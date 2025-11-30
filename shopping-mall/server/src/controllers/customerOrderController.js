import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import {
  asyncHandler,
  sendSuccess,
  sendError,
  sendNotFound,
  sendBadRequest,
  createPagination,
  calculatePagination,
} from "../utils/responseHelpers.js";

// 내 주문 목록 조회
export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, shippingStatus } = req.query;

  const query = {
    userId,
    isDeleted: false,
  };

  // 배송 상태 필터 추가
  if (shippingStatus && shippingStatus !== "전체") {
    query.shippingStatus = shippingStatus;
  }

  const {
    skip,
    limit: limitNum,
    page: pageNum,
  } = calculatePagination(page, limit);

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Order.countDocuments(query);

  sendSuccess(res, {
    orders,
    pagination: createPagination(pageNum, limitNum, total),
  });
});

// 내 주문 상세 조회
export const getMyOrderById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const order = await Order.findOne({
    _id: req.params.id,
    userId,
    isDeleted: false,
  }).populate("items.productId", "name images");

  if (!order) {
    return sendNotFound(res, "주문");
  }

  sendSuccess(res, order);
});

// 장바구니 기반 주문 생성
export const createOrderFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { shipping, paymentMethod = "card" } = req.body;

  if (
    !shipping ||
    !shipping.recipientName ||
    !shipping.phone ||
    !shipping.zipCode ||
    !shipping.address1
  ) {
    return sendBadRequest(
      res,
      "배송지 정보가 부족합니다. 수령인, 연락처, 우편번호, 주소는 필수입니다."
    );
  }

  // 장바구니 조회
  const cart = await Cart.findOne({ userId }).populate(
    "items.productId",
    "name images price stock status"
  );

  if (!cart || cart.items.length === 0) {
    return sendBadRequest(
      res,
      "장바구니가 비어 있어 주문을 생성할 수 없습니다."
    );
  }

  // 선택된 상품 ID 배열이 넘어왔다면, 해당 상품만 주문으로 생성
  const { selectedProductIds } = req.body;
  let cartItems = cart.items;

  if (Array.isArray(selectedProductIds) && selectedProductIds.length > 0) {
    const idSet = new Set(selectedProductIds.map((id) => id.toString()));
    cartItems = cartItems.filter((item) =>
      idSet.has(item.productId._id.toString())
    );
  }

  if (cartItems.length === 0) {
    return sendBadRequest(
      res,
      "주문할 상품이 없습니다. 선택한 상품을 다시 확인해주세요."
    );
  }

  // 재고/상태 확인 및 총액 계산
  let totalAmount = 0;
  const orderItems = [];

  for (const item of cartItems) {
    const product = await Product.findById(item.productId._id);

    if (!product || product.isDeleted || product.status !== "판매중") {
      return sendBadRequest(
        res,
        `상품 '${item.productId.name}'은(는) 현재 구매할 수 없습니다.`
      );
    }

    if (product.stock < item.quantity) {
      return sendBadRequest(
        res,
        `상품 '${product.name}'의 재고가 부족합니다. (현재 재고: ${product.stock}개)`
      );
    }

    const price = product.price ?? item.priceAtAdded ?? 0;
    const lineTotal = price * item.quantity;

    totalAmount += lineTotal;

    orderItems.push({
      productId: product._id,
      productName: product.name,
      productImage:
        (product.images && product.images[0]) ||
        "https://via.placeholder.com/120x120?text=Product",
      price,
      quantity: item.quantity,
      totalPrice: lineTotal,
    });
  }

  // 배송비/할인 등은 추후 확장; 현재는 totalAmount만 사용
  const orderNumber = Order.generateOrderNumber();

  // 결제 정보 추출
  const { impUid } = req.body;
  const paymentInfo = impUid
    ? {
        impUid,
        merchantUid: req.body.merchantUid || null,
        payMethod: paymentMethod === "card" ? "card" : null,
        paidAt: new Date(),
      }
    : null;

  const newOrder = await Order.create({
    orderNumber,
    userId,
    items: orderItems,
    totalAmount,
    shipping: {
      recipientName: shipping.recipientName,
      phone: shipping.phone,
      zipCode: shipping.zipCode,
      address1: shipping.address1,
      address2: shipping.address2 || "",
      memo: shipping.memo || "",
    },
    paymentStatus: impUid
      ? "결제완료"
      : paymentMethod === "card"
      ? "결제대기"
      : "결제대기",
    payment: paymentInfo,
  });

  // 재고 차감
  for (const item of cartItems) {
    await Product.updateOne(
      { _id: item.productId._id },
      { $inc: { stock: -item.quantity } }
    );
  }

  // 주문에 포함된 상품만 장바구니에서 제거
  const orderedIdSet = new Set(
    cartItems.map((item) => item.productId._id.toString())
  );
  cart.items = cart.items.filter(
    (item) => !orderedIdSet.has(item.productId.toString())
  );
  await cart.save();

  sendSuccess(res, { order: newOrder }, "주문이 생성되었습니다.", 201);
});

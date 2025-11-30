import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// 내 주문 목록 조회
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const query = {
      userId,
      isDeleted: false,
    };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    console.error("내 주문 목록 조회 오류:", error);
    res.status(500).json({
      error: "주문 목록을 불러오는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

// 내 주문 상세 조회
export const getMyOrderById = async (req, res) => {
  try {
    const userId = req.user._id;
    const order = await Order.findOne({
      _id: req.params.id,
      userId,
      isDeleted: false,
    }).populate("items.productId", "name images");

    if (!order) {
      return res.status(404).json({
        error: "주문을 찾을 수 없습니다.",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("내 주문 상세 조회 오류:", error);
    res.status(500).json({
      error: "주문 정보를 불러오는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

// 장바구니 기반 주문 생성
export const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shipping, paymentMethod = "card" } = req.body;

    if (
      !shipping ||
      !shipping.recipientName ||
      !shipping.phone ||
      !shipping.zipCode ||
      !shipping.address1
    ) {
      return res.status(400).json({
        error: "배송지 정보가 부족합니다. 수령인, 연락처, 우편번호, 주소는 필수입니다.",
      });
    }

    // 장바구니 조회
    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name images price stock status"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        error: "장바구니가 비어 있어 주문을 생성할 수 없습니다.",
      });
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
      return res.status(400).json({
        error: "주문할 상품이 없습니다. 선택한 상품을 다시 확인해주세요.",
      });
    }

    // 재고/상태 확인 및 총액 계산
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId._id);

      if (!product || product.isDeleted || product.status !== "판매중") {
        return res.status(400).json({
          error: `상품 '${item.productId.name}'은(는) 현재 구매할 수 없습니다.`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `상품 '${product.name}'의 재고가 부족합니다. (현재 재고: ${product.stock}개)`,
        });
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
      paymentStatus: paymentMethod === "card" ? "결제완료" : "결제대기",
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

    res.status(201).json({
      message: "주문이 생성되었습니다.",
      order: newOrder,
    });
  } catch (error) {
    console.error("주문 생성 오류:", error);
    res.status(500).json({
      error: "주문을 생성하는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};



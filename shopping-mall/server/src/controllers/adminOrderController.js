import Order from "../models/Order.js";
import User from "../models/User.js";
import {
  asyncHandler,
  sendSuccess,
  sendNotFound,
  sendBadRequest,
  createPagination,
  calculatePagination,
} from "../utils/responseHelpers.js";

/**
 * 주문 목록 조회
 */
export const getOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    status = "",
    date = "",
  } = req.query;

  const query = { isDeleted: false };

  // 검색어 필터 (주문번호, 고객명, 이메일)
  if (search) {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
      isDeleted: false,
    });

    const userIds = users.map((user) => user._id);

    query.$or = [
      { orderNumber: { $regex: search, $options: "i" } },
      { userId: { $in: userIds } },
    ];
  }

  // 배송 상태 필터
  if (status && status !== "전체") {
    query.shippingStatus = status;
  }

  // 날짜 필터
  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    query.createdAt = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const {
    skip,
    limit: limitNum,
    page: pageNum,
  } = calculatePagination(page, limit);

  const orders = await Order.find(query)
    .populate("userId", "name email phone")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Order.countDocuments(query);

  sendSuccess(res, {
    orders,
    pagination: createPagination(pageNum, limitNum, total),
  });
});

/**
 * 주문 상세 조회
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    isDeleted: false,
  })
    .populate("userId", "name email phone")
    .populate("items.productId", "name images");

  if (!order) {
    return sendNotFound(res, "주문");
  }

  sendSuccess(res, order);
});

/**
 * 배송 상태 변경
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { shippingStatus } = req.body;

  const validStatuses = [
    "주문접수",
    "배송준비중",
    "배송중",
    "배송완료",
    "취소",
    "반품",
  ];

  if (!validStatuses.includes(shippingStatus)) {
    return sendBadRequest(res, "유효하지 않은 배송 상태입니다.");
  }

  const order = await Order.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!order) {
    return sendNotFound(res, "주문");
  }

  order.shippingStatus = shippingStatus;
  await order.save();

  sendSuccess(res, { order }, "배송 상태가 변경되었습니다.");
});

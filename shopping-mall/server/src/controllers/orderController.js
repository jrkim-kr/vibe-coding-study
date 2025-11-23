import Order from "../models/Order.js";
import User from "../models/User.js";

/**
 * 주문 목록 조회
 */
export const getOrders = async (req, res) => {
  try {
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

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("주문 목록 조회 오류:", error);
    res.status(500).json({
      error: "주문 목록을 불러오는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

/**
 * 주문 상세 조회
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate("userId", "name email phone")
      .populate("items.productId", "name images");

    if (!order) {
      return res.status(404).json({
        error: "주문을 찾을 수 없습니다.",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("주문 상세 조회 오류:", error);
    res.status(500).json({
      error: "주문 정보를 불러오는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

/**
 * 배송 상태 변경
 */
export const updateOrderStatus = async (req, res) => {
  try {
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
      return res.status(400).json({
        error: "유효하지 않은 배송 상태입니다.",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!order) {
      return res.status(404).json({
        error: "주문을 찾을 수 없습니다.",
      });
    }

    order.shippingStatus = shippingStatus;
    await order.save();

    res.json({
      message: "배송 상태가 변경되었습니다.",
      order,
    });
  } catch (error) {
    console.error("배송 상태 변경 오류:", error);
    res.status(500).json({
      error: "배송 상태 변경 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};


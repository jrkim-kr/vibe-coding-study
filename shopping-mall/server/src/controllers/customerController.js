import User from "../models/User.js";
import Order from "../models/Order.js";

/**
 * 회원 목록 조회
 */
export const getCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status = "",
    } = req.query;

    const query = {
      isDeleted: false,
      role: "user", // 일반 회원만 조회
    };

    // 검색어 필터 (이름, 이메일, 전화번호)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // 상태 필터 (활성/비활성 - 여기서는 간단히 최근 로그인 기준으로 구분)
    // 실제로는 User 모델에 status 필드를 추가하는 것이 좋음
    if (status && status !== "전체") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (status === "활성") {
        query.updatedAt = { $gte: thirtyDaysAgo };
      } else if (status === "비활성") {
        query.updatedAt = { $lt: thirtyDaysAgo };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // 각 회원의 주문 정보 추가
    const customers = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.findActive({
          userId: user._id,
        });

        const orderCount = orders.length;
        const totalSpent = orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );

        // 상태 결정 (30일 이내 활동 = 활성)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const isActive = user.updatedAt >= thirtyDaysAgo;

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          joinDate: user.createdAt,
          lastLogin: user.updatedAt, // 실제로는 lastLogin 필드가 필요
          orderCount,
          totalSpent,
          status: isActive ? "활성" : "비활성",
        };
      })
    );

    const total = await User.countDocuments(query);

    res.json({
      customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("회원 목록 조회 오류:", error);
    res.status(500).json({
      error: "회원 목록을 불러오는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

/**
 * 회원 상세 조회
 */
export const getCustomerById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      isDeleted: false,
      role: "user",
    }).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        error: "회원을 찾을 수 없습니다.",
      });
    }

    // 주문 정보 조회
    const orders = await Order.findActive({
      userId: user._id,
    }).sort({ createdAt: -1 });

    const orderCount = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderAmount =
      orderCount > 0 ? Math.round(totalSpent / orderCount) : 0;

    // 상태 결정
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const isActive = user.updatedAt >= thirtyDaysAgo;

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      joinDate: user.createdAt,
      lastLogin: user.updatedAt,
      orderCount,
      totalSpent,
      averageOrderAmount,
      status: isActive ? "활성" : "비활성",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("회원 상세 조회 오류:", error);
    res.status(500).json({
      error: "회원 정보를 불러오는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

/**
 * 회원 상태 변경
 */
export const updateCustomerStatus = async (req, res) => {
  try {
    // 실제로는 User 모델에 status 필드를 추가하고 관리하는 것이 좋음
    // 여기서는 간단히 updatedAt을 조작하여 상태를 변경
    const { status } = req.body;

    if (!["활성", "비활성"].includes(status)) {
      return res.status(400).json({
        error: "유효하지 않은 상태입니다.",
      });
    }

    const user = await User.findOne({
      _id: req.params.id,
      isDeleted: false,
      role: "user",
    });

    if (!user) {
      return res.status(404).json({
        error: "회원을 찾을 수 없습니다.",
      });
    }

    // 상태에 따라 updatedAt 조작 (실제로는 status 필드 사용 권장)
    if (status === "활성") {
      user.updatedAt = new Date();
    } else {
      // 비활성으로 만들기 위해 30일 전으로 설정
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 31);
      user.updatedAt = thirtyDaysAgo;
    }

    await user.save();

    res.json({
      message: "회원 상태가 변경되었습니다.",
    });
  } catch (error) {
    console.error("회원 상태 변경 오류:", error);
    res.status(500).json({
      error: "회원 상태 변경 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};


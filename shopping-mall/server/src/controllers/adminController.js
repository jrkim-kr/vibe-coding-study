import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

/**
 * 대시보드 통계 조회
 */
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // 총 매출 (이번 달)
    const currentMonthOrders = await Order.findActive({
      paymentStatus: "결제완료",
      createdAt: { $gte: startOfMonth },
    });

    const totalRevenue = currentMonthOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // 지난 달 매출
    const lastMonthOrders = await Order.findActive({
      paymentStatus: "결제완료",
      createdAt: {
        $gte: startOfLastMonth,
        $lte: endOfLastMonth,
      },
    });

    const lastMonthRevenue = lastMonthOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // 매출 증가율 계산
    const revenueChange =
      lastMonthRevenue > 0
        ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    // 총 주문 수 (이번 달)
    const totalOrders = currentMonthOrders.length;
    const lastMonthOrdersCount = lastMonthOrders.length;
    const ordersChange =
      lastMonthOrdersCount > 0
        ? ((totalOrders - lastMonthOrdersCount) / lastMonthOrdersCount) * 100
        : 0;

    // 활성 사용자 수 (최근 1시간)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({
      isDeleted: false,
      updatedAt: { $gte: oneHourAgo },
    });

    // 총 고객 수
    const totalCustomers = await User.countDocuments({
      isDeleted: false,
      role: "user",
    });

    // 지난 달 고객 수
    const lastMonthCustomers = await User.countDocuments({
      isDeleted: false,
      role: "user",
      createdAt: { $lte: endOfLastMonth },
    });

    const customersChange =
      lastMonthCustomers > 0
        ? ((totalCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
        : 0;

    res.json({
      totalRevenue: {
        value: totalRevenue,
        change: revenueChange.toFixed(1),
        period: "from last month",
      },
      orders: {
        value: totalOrders,
        change: ordersChange.toFixed(1),
        period: "from last month",
      },
      activeUsers: {
        value: activeUsers,
        change: 0, // 실시간 데이터이므로 비교 불가
        period: "since last hour",
      },
      totalCustomers: {
        value: totalCustomers,
        change: customersChange.toFixed(1),
        period: "from last month",
      },
    });
  } catch (error) {
    console.error("대시보드 통계 조회 오류:", error);
    res.status(500).json({
      error: "대시보드 통계를 불러오는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

/**
 * 최근 매출 추이 조회
 */
export const getRecentRevenue = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await Order.findActive({
      paymentStatus: "결제완료",
      createdAt: { $gte: startDate },
    }).sort({ createdAt: 1 });

    // 날짜별로 그룹화
    const revenueByDate = {};
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      if (!revenueByDate[date]) {
        revenueByDate[date] = 0;
      }
      revenueByDate[date] += order.totalAmount;
    });

    // 배열로 변환
    const revenueData = Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    res.json(revenueData);
  } catch (error) {
    console.error("최근 매출 조회 오류:", error);
    res.status(500).json({
      error: "최근 매출을 불러오는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

/**
 * 최근 판매 내역 조회
 */
export const getRecentSales = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const orders = await Order.findActive({
      paymentStatus: "결제완료",
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(limit);

    const sales = orders.map((order) => ({
      id: order._id,
      customerName: order.userId.name,
      customerEmail: order.userId.email,
      amount: order.totalAmount,
      orderDate: order.createdAt,
    }));

    res.json(sales);
  } catch (error) {
    console.error("최근 판매 조회 오류:", error);
    res.status(500).json({
      error: "최근 판매 내역을 불러오는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};


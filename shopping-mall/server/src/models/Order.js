import mongoose from "mongoose";

// 주문 상품 서브스키마
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

// 배송지 정보 서브스키마
const shippingSchema = new mongoose.Schema({
  recipientName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
    default: "",
  },
  memo: {
    type: String,
    default: "",
  },
});

// 주문 스키마
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingStatus: {
      type: String,
      enum: ["주문접수", "배송준비중", "배송중", "배송완료", "취소", "반품"],
      default: "주문접수",
    },
    paymentStatus: {
      type: String,
      enum: ["결제대기", "결제완료", "결제실패", "환불완료"],
      default: "결제대기",
    },
    shipping: shippingSchema,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// 인덱스 생성
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ shippingStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

// 주문번호 생성 메서드
orderSchema.statics.generateOrderNumber = function () {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${year}${month}${day}-${random}`;
};

// isDeleted가 false인 주문만 조회
orderSchema.statics.findActive = function (query = {}) {
  return this.find({ ...query, isDeleted: false });
};

const Order = mongoose.model("Order", orderSchema);

export default Order;


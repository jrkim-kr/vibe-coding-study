import mongoose from "mongoose";

// 배송지 서브스키마
const addressSchema = new mongoose.Schema(
  {
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
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

// 사용자 스키마
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "유효한 이메일 주소를 입력해주세요."],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    addresses: [addressSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

// 이메일 인덱스 생성 (중복 확인 성능 향상)
userSchema.index({ email: 1 });

// isDeleted가 false인 사용자만 조회하는 메서드
userSchema.statics.findActive = function (query = {}) {
  return this.find({ ...query, isDeleted: false });
};

// isDeleted가 false이고 이메일로 조회하는 메서드
userSchema.statics.findActiveByEmail = function (email) {
  return this.findOne({ email, isDeleted: false });
};

const User = mongoose.model("User", userSchema);

export default User;


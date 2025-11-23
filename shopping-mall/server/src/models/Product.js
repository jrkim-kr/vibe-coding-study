import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["판매중", "판매중지", "품절"],
      default: "판매중",
    },
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
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ name: "text" }); // 텍스트 검색용

// isDeleted가 false인 상품만 조회
productSchema.statics.findActive = function (query = {}) {
  return this.find({ ...query, isDeleted: false });
};

const Product = mongoose.model("Product", productSchema);

export default Product;


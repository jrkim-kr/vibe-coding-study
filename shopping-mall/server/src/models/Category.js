import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    sortOrder: {
      type: Number,
      default: 0,
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
categorySchema.index({ parentCategory: 1, sortOrder: 1 });

// isDeleted가 false인 카테고리만 조회
categorySchema.statics.findActive = function (query = {}) {
  return this.find({ ...query, isDeleted: false });
};

const Category = mongoose.model("Category", categorySchema);

export default Category;


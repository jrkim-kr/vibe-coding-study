import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { deleteCloudinaryImages } from "../utils/cloudinary.js";

/**
 * 상품 목록 조회
 */
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      category = "",
      status = "",
    } = req.query;

    const query = { isDeleted: false };

    // 검색어 필터
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 카테고리 필터
    if (category) {
      const categoryDoc = await Category.findOne({
        name: category,
        isDeleted: false,
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // 상태 필터
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("상품 목록 조회 오류:", error);
    res.status(500).json({
      error: "상품 목록을 불러오는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

/**
 * 상품 상세 조회
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("category", "name");

    if (!product) {
      return res.status(404).json({
        error: "상품을 찾을 수 없습니다.",
      });
    }

    res.json(product);
  } catch (error) {
    console.error("상품 상세 조회 오류:", error);
    res.status(500).json({
      error: "상품 정보를 불러오는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

/**
 * 상품 등록
 */
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description, images, status } =
      req.body;

    console.log("상품 등록 요청:", {
      name,
      category,
      price,
      stock,
      imagesCount: images?.length || 0,
      status,
    });

    // 필수 필드 검증
    if (!name || !category || price === undefined || stock === undefined) {
      console.error("필수 필드 누락:", { name, category, price, stock });
      return res.status(400).json({
        error: "필수 정보를 입력해주세요.",
      });
    }

    // 카테고리 확인
    let categoryDoc;

    // category가 ObjectId 형식인지 확인
    if (mongoose.Types.ObjectId.isValid(category)) {
      // ObjectId인 경우
      categoryDoc = await Category.findOne({
        _id: new mongoose.Types.ObjectId(category),
        isDeleted: false,
      });
    } else {
      // 이름인 경우
      categoryDoc = await Category.findOne({
        name: String(category).trim(),
        isDeleted: false,
      });
    }

    if (!categoryDoc) {
      console.error("카테고리를 찾을 수 없음:", category);
      // 사용 가능한 카테고리 목록 조회
      const allCategories = await Category.find({ isDeleted: false }).select(
        "name"
      );
      return res.status(400).json({
        error: `유효하지 않은 카테고리입니다: "${category}". 사용 가능한 카테고리: ${allCategories
          .map((c) => c.name)
          .join(", ")}`,
      });
    }

    console.log(
      "카테고리 찾음:",
      categoryDoc.name,
      categoryDoc._id,
      "타입:",
      typeof categoryDoc._id
    );

    // 이미지 검증
    if (!images || images.length === 0) {
      console.error("이미지가 없음:", images);
      return res.status(400).json({
        error: "최소 1개의 이미지가 필요합니다.",
        details: "이미지를 업로드해주세요.",
      });
    }

    // images 배열의 유효성 검증
    const validImages = Array.isArray(images)
      ? images.filter(
          (img) => img && typeof img === "string" && img.trim().length > 0
        )
      : [];

    if (validImages.length === 0) {
      console.error("유효한 이미지가 없음:", images);
      return res.status(400).json({
        error: "유효한 이미지가 없습니다.",
        details: "이미지 URL이 올바른지 확인해주세요.",
      });
    }

    // 데이터 타입 검증 및 변환
    const productPrice = parseInt(price);
    const productStock = parseInt(stock);

    if (isNaN(productPrice) || productPrice < 0) {
      return res.status(400).json({
        error: "가격은 0 이상의 숫자여야 합니다.",
        received: price,
      });
    }

    if (isNaN(productStock) || productStock < 0) {
      return res.status(400).json({
        error: "재고는 0 이상의 숫자여야 합니다.",
        received: stock,
      });
    }

    // categoryDoc._id를 ObjectId로 변환
    let categoryObjectId;
    try {
      if (categoryDoc._id instanceof mongoose.Types.ObjectId) {
        categoryObjectId = categoryDoc._id;
      } else if (mongoose.Types.ObjectId.isValid(categoryDoc._id)) {
        categoryObjectId = new mongoose.Types.ObjectId(categoryDoc._id);
      } else {
        console.error(
          "유효하지 않은 카테고리 ID:",
          categoryDoc._id,
          "타입:",
          typeof categoryDoc._id
        );
        return res.status(400).json({
          error: "유효하지 않은 카테고리 ID입니다.",
        });
      }
    } catch (idError) {
      console.error("카테고리 ID 변환 오류:", idError);
      return res.status(400).json({
        error: "카테고리 ID 변환 중 오류가 발생했습니다.",
      });
    }

    console.log("상품 데이터 검증 완료:", {
      name: String(name).trim(),
      category: categoryObjectId.toString(),
      categoryType: "ObjectId",
      price: productPrice,
      stock: productStock,
      imagesCount: validImages.length,
      status: status || "판매중",
    });

    // Product 생성 전에 categoryObjectId가 유효한지 최종 확인
    console.log("최종 categoryObjectId 확인:", {
      value: categoryObjectId,
      type: typeof categoryObjectId,
      isObjectId: categoryObjectId instanceof mongoose.Types.ObjectId,
      toString: categoryObjectId.toString(),
    });

    const product = new Product({
      name: String(name).trim(),
      category: categoryObjectId, // 명시적으로 ObjectId로 변환
      price: productPrice,
      stock: productStock,
      description: description || "",
      images: validImages, // 유효한 이미지만 저장
      status: status || "판매중",
    });

    console.log("상품 저장 시도:", {
      name: product.name,
      category: product.category,
      categoryType: typeof product.category,
      categoryIsObjectId: product.category instanceof mongoose.Types.ObjectId,
      price: product.price,
      stock: product.stock,
      imagesCount: product.images.length,
    });

    try {
      await product.save();
      console.log(
        "상품 저장 성공:",
        product.name,
        "category ID:",
        product.category
      );

      // populate는 저장 후에 수행
      // product.category가 ObjectId인지 다시 확인
      if (
        product.category &&
        mongoose.Types.ObjectId.isValid(product.category)
      ) {
        try {
          await product.populate("category", "name");
          console.log("카테고리 populate 성공:", product.category?.name);
        } catch (populateError) {
          console.error("카테고리 populate 오류:", populateError);
          console.error("populate 오류 상세:", {
            message: populateError.message,
            name: populateError.name,
            path: populateError.path,
            value: populateError.value,
          });
          // populate 실패해도 상품은 저장되었으므로 계속 진행
          // category 정보를 수동으로 추가
          product.category = {
            _id: categoryObjectId,
            name: categoryDoc.name,
          };
        }
      } else {
        console.error(
          "유효하지 않은 category 값:",
          product.category,
          "타입:",
          typeof product.category
        );
        // category 정보를 수동으로 추가
        product.category = {
          _id: categoryObjectId,
          name: categoryDoc.name,
        };
      }
    } catch (saveError) {
      console.error("상품 저장 오류 상세:", saveError);
      console.error("상품 저장 오류 스택:", saveError.stack);
      console.error("상품 저장 오류 이름:", saveError.name);
      console.error("상품 저장 오류 메시지:", saveError.message);

      // CastError 처리 (타입 변환 오류)
      if (saveError.name === "CastError") {
        const castError = saveError;
        console.error("CastError 상세:", {
          kind: castError.kind,
          value: castError.value,
          path: castError.path,
          message: castError.message,
        });
        return res.status(400).json({
          error: "데이터 타입 오류가 발생했습니다.",
          details: `필드 "${castError.path}"에 잘못된 값이 입력되었습니다: ${castError.value}`,
          errorName: "CastError",
          path: castError.path,
          value: castError.value,
        });
      }

      // Mongoose 검증 오류 처리
      if (saveError.name === "ValidationError") {
        const validationErrors = Object.values(saveError.errors).map(
          (err) => err.message
        );
        return res.status(400).json({
          error: "상품 데이터 검증 실패",
          details: validationErrors,
          message: saveError.message,
        });
      }

      // 중복 키 에러 처리
      if (saveError.code === 11000 || saveError.name === "MongoServerError") {
        return res.status(409).json({
          error: "이미 존재하는 상품명입니다.",
        });
      }

      // 기타 오류는 상세 메시지와 함께 반환
      throw saveError;
    }

    res.status(201).json({
      message: "상품이 등록되었습니다.",
      product,
    });
  } catch (error) {
    console.error("상품 등록 오류:", error);
    console.error("오류 스택:", error.stack);
    console.error("오류 이름:", error.name);
    console.error("오류 코드:", error.code);

    // 이미 응답을 보낸 경우 (400, 409 등) 다시 보내지 않음
    if (res.headersSent) {
      return;
    }

    res.status(500).json({
      error: "상품 등록 중 오류가 발생했습니다.",
      message: error.message,
      errorName: error.name,
      errorCode: error.code,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

/**
 * 상품 수정
 */
export const updateProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description, images, status } =
      req.body;

    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        error: "상품을 찾을 수 없습니다.",
      });
    }

    // 카테고리 업데이트
    if (category) {
      const categoryDoc = await Category.findOne({
        $or: [{ _id: category }, { name: category }],
        isDeleted: false,
      });

      if (!categoryDoc) {
        return res.status(400).json({
          error: "유효하지 않은 카테고리입니다.",
        });
      }

      product.category = categoryDoc._id;
    }

    // 필드 업데이트
    if (name) product.name = name;
    if (price !== undefined) product.price = parseInt(price);
    if (stock !== undefined) product.stock = parseInt(stock);
    if (description !== undefined) product.description = description;
    if (images) {
      product.images = Array.isArray(images) ? images : [images];
    }
    if (status) product.status = status;

    await product.save();
    await product.populate("category", "name");

    res.json({
      message: "상품이 수정되었습니다.",
      product,
    });
  } catch (error) {
    console.error("상품 수정 오류:", error);
    res.status(500).json({
      error: "상품 수정 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

/**
 * 상품 삭제 (soft delete)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        error: "상품을 찾을 수 없습니다.",
      });
    }

    if (product.images && product.images.length > 0) {
      try {
        const { deleted, errors } = await deleteCloudinaryImages(product.images);
        if (errors.length > 0) {
          console.warn(
            `[Cloudinary] 일부 이미지 삭제 실패: ${JSON.stringify(errors)}`
          );
        } else {
          console.log(`[Cloudinary] ${deleted}개의 이미지를 삭제했습니다.`);
        }
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary 이미지 삭제 중 오류:",
          cloudinaryError.message
        );
      }
    }

    // 실제 DB에서 삭제
    await Product.findByIdAndDelete(product._id);

    res.json({
      message: "상품이 삭제되었습니다.",
    });
  } catch (error) {
    console.error("상품 삭제 오류:", error);
    res.status(500).json({
      error: "상품 삭제 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

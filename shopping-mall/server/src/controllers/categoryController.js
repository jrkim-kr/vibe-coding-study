import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

/**
 * 카테고리 목록 조회
 */
export const getCategories = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const query = { isDeleted: false };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const categories = await Category.find(query).sort({
      parentCategory: 1,
      sortOrder: 1,
    });

    // 상위 카테고리별로 그룹화
    const grouped = {};
    categories.forEach((category) => {
      const parentId = category.parentCategory
        ? category.parentCategory.toString()
        : "root";
      if (!grouped[parentId]) {
        grouped[parentId] = [];
      }
      grouped[parentId].push(category);
    });

    // 상위 카테고리 먼저, 그 다음 하위 카테고리
    const result = [];
    if (grouped["root"]) {
      result.push(...grouped["root"]);
    }

    Object.keys(grouped).forEach((parentId) => {
      if (parentId !== "root") {
        result.push(...grouped[parentId]);
      }
    });

    // 각 카테고리의 상품 수 계산
    const categoriesWithCount = await Promise.all(
      result.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
          isDeleted: false,
        });

        const parentCategory = category.parentCategory
          ? await Category.findById(category.parentCategory)
          : null;

        return {
          ...category.toObject(),
          productCount,
          parentCategoryName: parentCategory ? parentCategory.name : null,
        };
      })
    );

    res.json({
      categories: categoriesWithCount,
      total: categoriesWithCount.length,
    });
  } catch (error) {
    console.error("카테고리 목록 조회 오류:", error);
    res.status(500).json({
      error: "카테고리 목록을 불러오는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

/**
 * 카테고리 상세 조회
 */
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("parentCategory", "name");

    if (!category) {
      return res.status(404).json({
        error: "카테고리를 찾을 수 없습니다.",
      });
    }

    const productCount = await Product.countDocuments({
      category: category._id,
      isDeleted: false,
    });

    res.json({
      ...category.toObject(),
      productCount,
    });
  } catch (error) {
    console.error("카테고리 상세 조회 오류:", error);
    res.status(500).json({
      error: "카테고리 정보를 불러오는 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

/**
 * 카테고리 등록
 */
export const createCategory = async (req, res) => {
  try {
    const { name, parentCategory, sortOrder } = req.body;
    console.log("카테고리 등록 요청:", { name, parentCategory, sortOrder });

    if (!name) {
      return res.status(400).json({
        error: "카테고리명을 입력해주세요.",
      });
    }

    // 중복 확인
    const existing = await Category.findOne({
      name,
      isDeleted: false,
    });

    if (existing) {
      return res.status(409).json({
        error: "이미 존재하는 카테고리입니다.",
      });
    }

    // 상위 카테고리 확인
    let parentCategoryId = null;
    if (parentCategory && parentCategory !== "" && parentCategory !== null) {
      try {
        // parentCategory가 ObjectId 형식인지 확인
        const parentCategoryStr = String(parentCategory).trim();
        const isObjectId = mongoose.Types.ObjectId.isValid(parentCategoryStr) && 
                          parentCategoryStr.length === 24;
        
        let parent;
        if (isObjectId) {
          // ObjectId인 경우
          try {
            parent = await Category.findOne({
              _id: new mongoose.Types.ObjectId(parentCategoryStr),
              isDeleted: false,
            });
          } catch (idError) {
            // ObjectId 변환 실패 시 이름으로 조회 시도
            parent = await Category.findOne({
              name: parentCategoryStr,
              isDeleted: false,
            });
          }
        } else {
          // 이름인 경우 - 정확히 일치하는 카테고리 찾기
          parent = await Category.findOne({
            name: { $regex: new RegExp(`^${parentCategoryStr}$`, "i") },
            isDeleted: false,
          });
          
          // 대소문자 구분하여 정확히 일치하는 것도 시도
          if (!parent) {
            parent = await Category.findOne({
              name: parentCategoryStr,
              isDeleted: false,
            });
          }
        }

        if (!parent) {
          // 모든 카테고리 목록을 로그로 출력하여 디버깅
          const allCategories = await Category.find({ isDeleted: false }).select("name");
          console.error("상위 카테고리를 찾을 수 없음:", {
            찾으려는값: parentCategoryStr,
            전체카테고리: allCategories.map(c => c.name)
          });
          return res.status(400).json({
            error: `유효하지 않은 상위 카테고리입니다: "${parentCategoryStr}". 사용 가능한 카테고리: ${allCategories.map(c => c.name).join(", ")}`,
          });
        }

        parentCategoryId = parent._id;
        console.log("상위 카테고리 찾음:", parent.name, parentCategoryId);
      } catch (error) {
        console.error("상위 카테고리 조회 오류:", error);
        return res.status(400).json({
          error: `상위 카테고리를 찾는 중 오류가 발생했습니다: ${error.message}`,
        });
      }
    }

    const category = new Category({
      name,
      parentCategory: parentCategoryId,
      sortOrder: parseInt(sortOrder) || 0,
    });

    try {
      await category.save();
      console.log("카테고리 저장 성공:", category.name, "상위 카테고리:", parentCategoryId);
    } catch (saveError) {
      console.error("카테고리 저장 오류:", saveError);
      // 중복 키 에러 처리
      if (saveError.code === 11000 || saveError.name === "MongoServerError") {
        return res.status(409).json({
          error: "이미 존재하는 카테고리명입니다.",
        });
      }
      throw saveError;
    }

    res.status(201).json({
      message: "카테고리가 등록되었습니다.",
      category,
    });
  } catch (error) {
    console.error("카테고리 등록 오류:", error);
    res.status(500).json({
      error: "카테고리 등록 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

/**
 * 카테고리 수정
 */
export const updateCategory = async (req, res) => {
  try {
    const { name, parentCategory, sortOrder } = req.body;

    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!category) {
      return res.status(404).json({
        error: "카테고리를 찾을 수 없습니다.",
      });
    }

    // 이름 변경 시 중복 확인
    if (name && name !== category.name) {
      const existing = await Category.findOne({
        name,
        isDeleted: false,
        _id: { $ne: category._id },
      });

      if (existing) {
        return res.status(409).json({
          error: "이미 존재하는 카테고리명입니다.",
        });
      }

      category.name = name;
    }

    // 상위 카테고리 업데이트
    if (parentCategory !== undefined) {
      if (parentCategory === null || parentCategory === "") {
        category.parentCategory = null;
      } else {
        try {
          // parentCategory가 ObjectId 형식인지 확인
          const isObjectId = mongoose.Types.ObjectId.isValid(parentCategory) && 
                            parentCategory.toString().length === 24;
          
          let parent;
          if (isObjectId) {
            // ObjectId인 경우
            parent = await Category.findOne({
              _id: new mongoose.Types.ObjectId(parentCategory),
              isDeleted: false,
              _id: { $ne: category._id }, // 자기 자신은 상위 카테고리가 될 수 없음
            });
          } else {
            // 이름인 경우
            parent = await Category.findOne({
              name: String(parentCategory).trim(),
              isDeleted: false,
              _id: { $ne: category._id }, // 자기 자신은 상위 카테고리가 될 수 없음
            });
          }

          if (!parent) {
            return res.status(400).json({
              error: "유효하지 않은 상위 카테고리입니다.",
            });
          }

          category.parentCategory = parent._id;
        } catch (error) {
          console.error("상위 카테고리 조회 오류:", error);
          return res.status(400).json({
            error: "상위 카테고리를 찾는 중 오류가 발생했습니다.",
          });
        }
      }
    }

    if (sortOrder !== undefined) {
      category.sortOrder = parseInt(sortOrder);
    }

    await category.save();

    res.json({
      message: "카테고리가 수정되었습니다.",
      category,
    });
  } catch (error) {
    console.error("카테고리 수정 오류:", error);
    res.status(500).json({
      error: "카테고리 수정 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

/**
 * 카테고리 삭제 (hard delete)
 */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!category) {
      return res.status(404).json({
        error: "카테고리를 찾을 수 없습니다.",
      });
    }

    // 하위 카테고리 확인
    const subCategories = await Category.countDocuments({
      parentCategory: category._id,
      isDeleted: false,
    });

    if (subCategories > 0) {
      return res.status(400).json({
        error: "하위 카테고리가 있어 삭제할 수 없습니다.",
      });
    }

    // 상품이 있는지 확인
    const productCount = await Product.countDocuments({
      category: category._id,
      isDeleted: false,
    });

    if (productCount > 0) {
      return res.status(400).json({
        error: "해당 카테고리에 등록된 상품이 있어 삭제할 수 없습니다.",
      });
    }

    // 실제 DB에서 삭제
    await Category.findByIdAndDelete(category._id);

    res.json({
      message: "카테고리가 삭제되었습니다.",
    });
  } catch (error) {
    console.error("카테고리 삭제 오류:", error);
    res.status(500).json({
      error: "카테고리 삭제 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};


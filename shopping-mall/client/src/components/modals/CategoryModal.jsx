import { useState, useEffect } from "react";
import "./CategoryModal.css";

function CategoryModal({ category, parentCategories, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    parentCategory: "",
    sortOrder: 1,
  });

  useEffect(() => {
    if (category) {
      // parentCategory가 객체인 경우 name 추출, 또는 ID인 경우 name 찾기
      let parentCategoryName = "";
      if (category.parentCategory) {
        if (typeof category.parentCategory === "string") {
          parentCategoryName = category.parentCategory;
        } else if (category.parentCategory.name) {
          parentCategoryName = category.parentCategory.name;
        } else if (category.parentCategoryName) {
          parentCategoryName = category.parentCategoryName;
        }
      }

      setFormData({
        name: category.name || "",
        parentCategory: parentCategoryName,
        sortOrder: category.sortOrder || 1,
      });
    } else {
      setFormData({
        name: "",
        parentCategory: "",
        sortOrder: 1,
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sortOrder" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 서버로 보낼 데이터만 정리 (불필요한 필드 제거)
    const categoryData = {
      name: formData.name.trim(),
      parentCategory: formData.parentCategory && formData.parentCategory !== "" 
        ? formData.parentCategory.trim() 
        : null,
      sortOrder: parseInt(formData.sortOrder) || 1,
    };

    console.log("카테고리 데이터 전송:", categoryData);
    onSave(categoryData);
  };

  return (
    <div className="category-modal-overlay" onClick={onClose}>
      <div className="category-modal" onClick={(e) => e.stopPropagation()}>
        <div className="category-modal-header">
          <h2 className="category-modal-title">
            {category ? "카테고리 수정" : "카테고리 등록"}
          </h2>
          <button className="category-modal-close" onClick={onClose}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="category-modal-form" onSubmit={handleSubmit}>
          <div className="category-form-group">
            <label className="category-form-label">
              카테고리명 <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="category-form-input"
              required
              placeholder="예: 아우터, 니트, 상의 등"
            />
          </div>

          <div className="category-form-group">
            <label className="category-form-label">상위 카테고리</label>
            <select
              name="parentCategory"
              value={formData.parentCategory}
              onChange={handleChange}
              className="category-form-select"
            >
              <option value="">상위 카테고리 없음</option>
              {parentCategories.map((parent) => {
                const parentId = parent._id || parent.id;
                const parentName = parent.name;
                return (
                  <option key={parentId} value={parentName}>
                    {parentName}
                  </option>
                );
              })}
            </select>
            <p className="category-form-help">
              하위 카테고리를 만들려면 상위 카테고리를 선택하세요
            </p>
          </div>

          <div className="category-form-group">
            <label className="category-form-label">
              정렬 순서 <span className="required">*</span>
            </label>
            <input
              type="number"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleChange}
              className="category-form-input"
              min="1"
              required
              placeholder="숫자가 작을수록 먼저 표시됩니다"
            />
            <p className="category-form-help">
              숫자가 작을수록 목록에서 먼저 표시됩니다
            </p>
          </div>

          <div className="category-modal-actions">
            <button
              type="button"
              className="category-modal-cancel"
              onClick={onClose}
            >
              취소
            </button>
            <button type="submit" className="category-modal-submit">
              {category ? "수정" : "등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;


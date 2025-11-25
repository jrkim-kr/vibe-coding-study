import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import { uploadMultipleImages } from "../utils/cloudinary";
import "./ProductModal.css";

const createInitialForm = (categories, statuses) => ({
  name: "",
  category: categories[0] || "",
  price: "",
  stock: "",
  description: "",
  status: statuses[0] || "",
});

const createInitialImages = () => ({
  existing: [],
  pending: [],
});

function ProductModal({ product, categories, statuses, onSave, onClose }) {
  const [formData, setFormData] = useState(createInitialForm(categories, statuses));
  const [images, setImages] = useState(createInitialImages());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      // product.category가 객체인 경우 name 추출
      const categoryName =
        typeof product.category === "string"
          ? product.category
          : product.category?.name || categories[0] || "";

      setFormData({
        name: product.name || "",
        category: categoryName,
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        status: product.status || statuses[0] || "",
      });
      setImages({
        existing: product.images && product.images.length > 0 ? product.images : [],
        pending: [],
      });
    } else {
      setFormData(createInitialForm(categories, statuses));
      setImages(createInitialImages());
    }
  }, [product, categories, statuses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesChange = (nextImages) => {
    setImages(nextImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalImages = images.existing.length + images.pending.length;
    if (totalImages === 0) {
      alert("최소 1개의 이미지를 업로드해주세요.");
      return;
    }

    if (saving) {
      return;
    }

    setSaving(true);

    try {
      let uploadedUrls = [];

      if (images.pending.length > 0) {
        const files = images.pending.map((item) => item.file);
        uploadedUrls = await uploadMultipleImages(files);
      }

      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description || "",
        images: [...images.existing, ...uploadedUrls],
        status: formData.status || "판매중",
      };

      console.log("상품 데이터 전송:", productData);

      if (product) {
        productData.id = product.id;
      }

      await onSave(productData);
      setImages(createInitialImages());
    } catch (error) {
      alert(error.message || "이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="product-modal-header">
          <h2 className="product-modal-title">
            {product ? "상품 수정" : "상품 등록"}
          </h2>
          <button className="product-modal-close" onClick={onClose}>
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

        <form className="product-modal-form" onSubmit={handleSubmit}>
          <div className="product-form-group">
            <label className="product-form-label">
              상품명 <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="product-form-input"
              required
            />
          </div>

          <div className="product-form-row">
            <div className="product-form-group">
              <label className="product-form-label">
                카테고리 <span className="required">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="product-form-select"
                required
                disabled={categories.length === 0}
              >
                {categories.length === 0 ? (
                  <option value="">카테고리를 먼저 등록해주세요</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))
                )}
              </select>
              {categories.length === 0 && (
                <p style={{ color: "#f59e0b", fontSize: "12px", marginTop: "4px" }}>
                  카테고리 관리 페이지에서 카테고리를 먼저 등록해주세요.
                </p>
              )}
            </div>

            <div className="product-form-group">
              <label className="product-form-label">
                상태 <span className="required">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="product-form-select"
                required
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="product-form-row">
            <div className="product-form-group">
              <label className="product-form-label">
                가격 <span className="required">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="product-form-input"
                min="0"
                required
              />
            </div>

            <div className="product-form-group">
              <label className="product-form-label">
                재고 수량 <span className="required">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="product-form-input"
                min="0"
                required
              />
            </div>
          </div>

          <div className="product-form-group">
            <label className="product-form-label">상품 설명</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="product-form-textarea"
              rows="4"
            />
          </div>

          <div className="product-form-group">
            <label className="product-form-label">
              상품 이미지 <span className="required">*</span>
            </label>
            <ImageUploader images={images} onChange={handleImagesChange} maxImages={5} />
          </div>

          <div className="product-modal-actions">
            <button
              type="button"
              className="product-modal-cancel"
              onClick={onClose}
            >
              취소
            </button>
            <button type="submit" className="product-modal-submit" disabled={saving}>
              {saving ? "처리 중..." : product ? "수정" : "등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;

import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import "./ProductModal.css";

function ProductModal({ product, categories, statuses, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    category: categories[0] || "",
    price: "",
    stock: "",
    description: "",
    images: [],
    status: statuses[0] || "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || categories[0] || "",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        images: product.images && product.images.length > 0 
          ? product.images 
          : [],
        status: product.status || statuses[0] || "",
      });
    }
  }, [product, categories, statuses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesChange = (images) => {
    setFormData((prev) => ({
      ...prev,
      images: images,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 이미지가 최소 1개는 있어야 함
    if (formData.images.length === 0) {
      alert("최소 1개의 이미지를 업로드해주세요.");
      return;
    }
    
    const productData = {
      ...formData,
      price: parseInt(formData.price),
      stock: parseInt(formData.stock),
      images: formData.images,
    };

    if (product) {
      productData.id = product.id;
    }

    onSave(productData);
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
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
            <ImageUploader
              images={formData.images}
              onChange={handleImagesChange}
              maxImages={5}
            />
          </div>

          <div className="product-modal-actions">
            <button
              type="button"
              className="product-modal-cancel"
              onClick={onClose}
            >
              취소
            </button>
            <button type="submit" className="product-modal-submit">
              {product ? "수정" : "등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;


import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import ProductModal from "../components/ProductModal";
import "./AdminProducts.css";

const initialProducts = [
  {
    id: 1,
    name: "페포 벌로 퍼 레더 자켓",
    category: "아우터",
    price: 40900,
    stock: 15,
    description: "고급스러운 레더 자켓",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    ],
    status: "판매중",
  },
  {
    id: 2,
    name: "체르디 앙고라 헤어리 루즈 V 넥 니트 가디건",
    category: "니트",
    price: 48600,
    stock: 8,
    description: "부드러운 앙고라 니트",
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4c?auto=format&fit=crop&w=800&q=80",
    ],
    status: "판매중",
  },
  {
    id: 3,
    name: "[MADE] 누브라 부클 누빔 하이넥 집업 점퍼",
    category: "아우터",
    price: 60200,
    stock: 0,
    description: "따뜻한 누빔 점퍼",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    ],
    status: "품절",
  },
  {
    id: 4,
    name: "레논 울 헤어리 라운드 노르딕 니트 가디건",
    category: "니트",
    price: 26000,
    stock: 22,
    description: "클래식한 노르딕 니트",
    images: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
    ],
    status: "판매중",
  },
];

const categories = ["아우터", "니트", "상의", "하의", "액세서리"];
const statuses = ["판매중", "판매중지", "품절"];

function AdminProducts() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("products");
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // URL 경로에 따라 activeMenu 설정
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/") {
      setActiveMenu("dashboard");
    } else if (path.includes("/products")) {
      setActiveMenu("products");
    } else if (path.includes("/orders")) {
      setActiveMenu("orders");
    } else if (path.includes("/categories")) {
      setActiveMenu("categories");
    } else if (path.includes("/customers")) {
      setActiveMenu("customers");
    }
  }, [location.pathname]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("정말 이 상품을 삭제하시겠습니까?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // 수정
      setProducts(
        products.map((p) => (p.id === editingProduct.id ? productData : p))
      );
    } else {
      // 등록
      const newProduct = {
        ...productData,
        id: Math.max(...products.map((p) => p.id)) + 1,
      };
      setProducts([...products, newProduct]);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "판매중":
        return "status-active";
      case "판매중지":
        return "status-inactive";
      case "품절":
        return "status-out";
      default:
        return "";
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="admin-main">
        <header className="admin-header">
          <h1 className="admin-logo">COMMON UNIQUE</h1>
          <h2 className="admin-console-title">Admin Console</h2>
          <div className="admin-user">
            <svg
              className="admin-user-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4.5 20c2-3 4.5-4.5 7.5-4.5s5.5 1.5 7.5 4.5" />
            </svg>
            <span>admin@common-unique.com</span>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-header">
            <div>
              <h2 className="admin-page-title">상품 관리</h2>
              <p className="admin-page-subtitle">
                상품을 등록, 수정, 삭제할 수 있습니다
              </p>
            </div>
            <button className="admin-add-btn" onClick={handleAddProduct}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              상품 등록
            </button>
          </div>

          <div className="admin-products-toolbar">
            <div className="admin-search-box">
              <svg
                className="admin-search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="상품명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-search-input"
              />
            </div>
            <div className="admin-products-count">
              총 {filteredProducts.length}개
            </div>
          </div>

          <div className="admin-products-table-container">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>이미지</th>
                  <th>상품명</th>
                  <th>카테고리</th>
                  <th>가격</th>
                  <th>재고</th>
                  <th>상태</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="admin-empty-state">
                      검색 결과가 없습니다
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-image">
                          <img
                            src={product.images[0] || ""}
                            alt={product.name}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="admin-product-name">{product.name}</div>
                      </td>
                      <td>
                        <span className="admin-product-category">
                          {product.category}
                        </span>
                      </td>
                      <td>
                        <span className="admin-product-price">
                          ₩ {product.price.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className="admin-product-stock">
                          {product.stock}개
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-product-status ${getStatusClass(
                            product.status
                          )}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <div className="admin-product-actions">
                          <button
                            className="admin-action-btn admin-edit-btn"
                            onClick={() => handleEditProduct(product)}
                          >
                            수정
                          </button>
                          <button
                            className="admin-action-btn admin-delete-btn"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          statuses={statuses}
          onSave={handleSaveProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminProducts;


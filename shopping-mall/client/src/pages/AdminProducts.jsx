import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import ProductModal from "../components/ProductModal";
import { productAPI, categoryAPI } from "../utils/api";
import "./AdminProducts.css";

const statuses = ["판매중", "판매중지", "품절"];

function AdminProducts() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("products");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

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

  // 화면 크기가 1024px보다 클 때는 사이드바를 항상 열어둠
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // 초기 설정
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 초기 로드: 카테고리 로드 (한 번만)
  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 검색어 변경 시 페이지를 1로 리셋하고 상품 목록 다시 로드
  useEffect(() => {
    setCurrentPage(1);
    loadProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const loadProducts = async (page = currentPage) => {
    try {
      setLoading(true);
      setError("");

      // 토큰 확인
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("로그인이 필요합니다. 다시 로그인해주세요.");
      }

      const response = await productAPI.getProducts({
        search: searchTerm,
        page,
        // limit은 보내지 않고, 백엔드 기본값(2개)에만 의존
      });

      setProducts(response.products || []);

      // 백엔드에서 내려주는 페이지네이션 정보가 있으면 사용
      if (response.pagination) {
        setCurrentPage(response.pagination.page || page);
        setTotalPages(response.pagination.pages || 1);
        setTotalCount(
          response.pagination.total || response.products?.length || 0
        );
      } else {
        // pagination 정보가 없다면 fallback
        setCurrentPage(page);
        setTotalPages(1);
        setTotalCount(response.products?.length || 0);
      }
    } catch (err) {
      console.error("상품 목록 로드 오류:", err);
      const errorMessage =
        err.message || "상품 목록을 불러오는 중 오류가 발생했습니다.";
      setError(errorMessage);

      // 인증 오류인 경우 로그인 페이지로 리다이렉트
      if (errorMessage.includes("인증") || errorMessage.includes("로그인")) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      console.log("카테고리 응답:", response); // 디버깅용

      if (
        response &&
        response.categories &&
        Array.isArray(response.categories)
      ) {
        const categoryNames = response.categories.map((cat) => cat.name);
        console.log("카테고리 이름 목록:", categoryNames); // 디버깅용
        setCategories(categoryNames);

        // 카테고리가 없으면 기본 카테고리 추가
        if (categoryNames.length === 0) {
          console.warn("카테고리가 없습니다. 기본 카테고리를 추가하세요.");
        }
      } else {
        console.error("카테고리 응답 형식 오류:", response);
        setCategories([]);
      }
    } catch (err) {
      console.error("카테고리 로드 오류:", err);
      setCategories([]);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("정말 이 상품을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await productAPI.deleteProduct(id);
      alert("상품이 삭제되었습니다.");
      loadProducts(1); // 삭제 후 첫 페이지로 새로고침
    } catch (err) {
      alert(err.message || "상품 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      console.log("상품 저장 시도:", productData);
      if (editingProduct) {
        // 수정
        const response = await productAPI.updateProduct(
          editingProduct._id || editingProduct.id,
          productData
        );
        console.log("상품 수정 응답:", response);
        alert("상품이 수정되었습니다.");
      } else {
        // 등록
        const response = await productAPI.createProduct(productData);
        console.log("상품 등록 응답:", response);
        alert("상품이 등록되었습니다.");
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      loadProducts(1); // 저장 후 첫 페이지로 새로고침
    } catch (err) {
      console.error("상품 저장 오류 상세:", err);
      alert(err.message || "상품 저장 중 오류가 발생했습니다.");
    }
  };

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

  // API 응답 형식에 맞게 데이터 변환
  const formatProductForDisplay = (product) => {
    return {
      ...product,
      id: product._id || product.id,
      category: product.category?.name || product.category || "",
    };
  };

  return (
    <div className="admin-container">
      <AdminSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="admin-main">
        <AdminHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />

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
            <div className="admin-products-count">총 {totalCount}개</div>
          </div>

          {error && <div className="admin-error-message">{error}</div>}

          <div className="admin-products-table-container">
            {loading ? (
              <div className="admin-loading">로딩 중...</div>
            ) : (
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
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="admin-empty-state">
                        {searchTerm
                          ? "검색 결과가 없습니다"
                          : "등록된 상품이 없습니다"}
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => {
                      const formattedProduct = formatProductForDisplay(product);
                      return (
                        <tr key={formattedProduct.id}>
                          <td>
                            <div className="admin-product-image">
                              <img
                                src={
                                  formattedProduct.images?.[0] ||
                                  "https://via.placeholder.com/60"
                                }
                                alt={formattedProduct.name}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="admin-product-name">
                              {formattedProduct.name}
                            </div>
                          </td>
                          <td>
                            <span className="admin-product-category">
                              {formattedProduct.category}
                            </span>
                          </td>
                          <td>
                            <span className="admin-product-price">
                              ₩ {formattedProduct.price?.toLocaleString() || 0}
                            </span>
                          </td>
                          <td>
                            <span className="admin-product-stock">
                              {formattedProduct.stock || 0}개
                            </span>
                          </td>
                          <td>
                            <span
                              className={`admin-product-status ${getStatusClass(
                                formattedProduct.status
                              )}`}
                            >
                              {formattedProduct.status}
                            </span>
                          </td>
                          <td>
                            <div className="admin-product-actions">
                              <button
                                className="admin-action-btn admin-edit-btn"
                                onClick={() =>
                                  handleEditProduct(formattedProduct)
                                }
                              >
                                수정
                              </button>
                              <button
                                className="admin-action-btn admin-delete-btn"
                                onClick={() =>
                                  handleDeleteProduct(formattedProduct.id)
                                }
                              >
                                삭제
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* 페이지네이션 */}
          {!loading && totalPages > 1 && (
            <div className="admin-pagination">
              <button
                className="admin-page-btn"
                onClick={() => currentPage > 1 && loadProducts(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNumber = idx + 1;
                return (
                  <button
                    key={pageNumber}
                    className={`admin-page-btn ${
                      currentPage === pageNumber ? "active" : ""
                    }`}
                    onClick={() => loadProducts(pageNumber)}
                    disabled={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                className="admin-page-btn"
                onClick={() =>
                  currentPage < totalPages && loadProducts(currentPage + 1)
                }
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          )}
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

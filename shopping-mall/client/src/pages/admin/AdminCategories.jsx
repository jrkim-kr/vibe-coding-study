import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import CategoryModal from "../../components/modals/CategoryModal";
import { categoryAPI } from "../../utils/api";
import "./AdminCategories.css";

function AdminCategories() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("categories");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    loadCategories();
  }, [searchTerm]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await categoryAPI.getCategories(params);
      setCategories(response.categories || []);
    } catch (err) {
      console.error("카테고리 목록 로드 오류:", err);
      setError(err.message || "카테고리 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("정말 이 카테고리를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await categoryAPI.deleteCategory(id);
      alert("카테고리가 삭제되었습니다.");
      loadCategories(); // 목록 새로고침
    } catch (err) {
      alert(err.message || "카테고리 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      console.log("카테고리 저장 시도:", categoryData);
      if (editingCategory) {
        // 수정
        await categoryAPI.updateCategory(editingCategory._id || editingCategory.id, categoryData);
        alert("카테고리가 수정되었습니다.");
      } else {
        // 등록
        const response = await categoryAPI.createCategory(categoryData);
        console.log("카테고리 등록 응답:", response);
        alert("카테고리가 등록되었습니다.");
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      loadCategories(); // 목록 새로고침
    } catch (err) {
      console.error("카테고리 저장 오류 상세:", err);
      alert(err.message || "카테고리 저장 중 오류가 발생했습니다.");
    }
  };

  // 상위 카테고리 목록 (parentCategory가 null인 것만)
  const parentCategories = categories.filter(
    (c) => !c.parentCategory || !c.parentCategoryId
  );

  // 상위 카테고리별로 그룹화
  const groupedCategories = categories.reduce((acc, category) => {
    const parentName = category.parentCategoryName || 
                      (category.parentCategory?.name) ||
                      (category.parentCategoryId ? "하위 카테고리" : null) ||
                      "상위 카테고리 없음";
    
    if (!acc[parentName]) {
      acc[parentName] = [];
    }
    acc[parentName].push(category);
    return acc;
  }, {});

  // 정렬: 상위 카테고리 먼저, 그 다음 하위 카테고리
  const sortedGroups = Object.keys(groupedCategories).sort((a, b) => {
    if (a === "상위 카테고리 없음") return -1;
    if (b === "상위 카테고리 없음") return 1;
    return a.localeCompare(b);
  });

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
              <h2 className="admin-page-title">카테고리 관리</h2>
              <p className="admin-page-subtitle">
                카테고리를 등록, 수정, 삭제할 수 있습니다
              </p>
            </div>
            <button className="admin-add-btn" onClick={handleAddCategory}>
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
              카테고리 등록
            </button>
          </div>

          <div className="admin-categories-toolbar">
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
                placeholder="카테고리명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-search-input"
              />
            </div>
            <div className="admin-categories-count">
              총 {categories.length}개
            </div>
          </div>

          {error && (
            <div className="admin-error-message">{error}</div>
          )}

          <div className="admin-categories-container">
            {loading ? (
              <div className="admin-loading">로딩 중...</div>
            ) : sortedGroups.length === 0 ? (
              <div className="admin-empty-state">
                {searchTerm ? "검색 결과가 없습니다" : "등록된 카테고리가 없습니다"}
              </div>
            ) : (
              sortedGroups.map((parentName) => (
                <div key={parentName} className="admin-category-group">
                  {parentName !== "상위 카테고리 없음" && (
                    <h3 className="admin-category-group-title">{parentName}</h3>
                  )}
                  <div className="admin-categories-table-container">
                    <table className="admin-categories-table">
                      <thead>
                        <tr>
                          <th>카테고리명</th>
                          <th>상위 카테고리</th>
                          <th>정렬 순서</th>
                          <th>상품 수</th>
                          <th>작업</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedCategories[parentName]
                          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                          .map((category) => {
                            const categoryId = category._id || category.id;
                            const parentName = category.parentCategoryName || 
                                             (category.parentCategory?.name) || 
                                             "-";
                            
                            return (
                              <tr key={categoryId}>
                                <td>
                                  <div className="admin-category-name">
                                    {category.name}
                                  </div>
                                </td>
                                <td>
                                  <span className="admin-category-parent">
                                    {parentName}
                                  </span>
                                </td>
                                <td>
                                  <span className="admin-category-sort">
                                    {category.sortOrder || 0}
                                  </span>
                                </td>
                                <td>
                                  <span className="admin-category-count">
                                    {category.productCount || 0}개
                                  </span>
                                </td>
                                <td>
                                  <div className="admin-category-actions">
                                    <button
                                      className="admin-action-btn admin-edit-btn"
                                      onClick={() => handleEditCategory(category)}
                                    >
                                      수정
                                    </button>
                                    <button
                                      className="admin-action-btn admin-delete-btn"
                                      onClick={() => handleDeleteCategory(categoryId)}
                                    >
                                      삭제
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CategoryModal
          category={editingCategory}
          parentCategories={parentCategories}
          onSave={handleSaveCategory}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminCategories;

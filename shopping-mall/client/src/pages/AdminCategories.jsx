import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import CategoryModal from "../components/CategoryModal";
import "./AdminCategories.css";

const initialCategories = [
  {
    id: 1,
    name: "아우터",
    parentCategory: null,
    sortOrder: 1,
    productCount: 12,
  },
  {
    id: 2,
    name: "니트",
    parentCategory: null,
    sortOrder: 2,
    productCount: 8,
  },
  {
    id: 3,
    name: "상의",
    parentCategory: null,
    sortOrder: 3,
    productCount: 25,
  },
  {
    id: 4,
    name: "하의",
    parentCategory: null,
    sortOrder: 4,
    productCount: 18,
  },
  {
    id: 5,
    name: "액세서리",
    parentCategory: null,
    sortOrder: 5,
    productCount: 15,
  },
  {
    id: 6,
    name: "자켓",
    parentCategory: "아우터",
    sortOrder: 1,
    productCount: 5,
  },
  {
    id: 7,
    name: "코트",
    parentCategory: "아우터",
    sortOrder: 2,
    productCount: 4,
  },
  {
    id: 8,
    name: "가디건",
    parentCategory: "니트",
    sortOrder: 1,
    productCount: 6,
  },
];

function AdminCategories() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("categories");
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
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

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("정말 이 카테고리를 삭제하시겠습니까?")) {
      setCategories(categories.filter((c) => c.id !== id));
      alert("카테고리가 삭제되었습니다.");
    }
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      // 수정
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id ? categoryData : c
        )
      );
      alert("카테고리가 수정되었습니다.");
    } else {
      // 등록
      const newCategory = {
        ...categoryData,
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        productCount: 0,
      };
      setCategories([...categories, newCategory]);
      alert("카테고리가 등록되었습니다.");
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // 상위 카테고리 목록 (parentCategory가 null인 것만)
  const parentCategories = categories.filter((c) => !c.parentCategory);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 상위 카테고리별로 그룹화
  const groupedCategories = filteredCategories.reduce((acc, category) => {
    const parent = category.parentCategory || "상위 카테고리 없음";
    if (!acc[parent]) {
      acc[parent] = [];
    }
    acc[parent].push(category);
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
              총 {filteredCategories.length}개
            </div>
          </div>

          <div className="admin-categories-container">
            {sortedGroups.length === 0 ? (
              <div className="admin-empty-state">검색 결과가 없습니다</div>
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
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((category) => (
                            <tr key={category.id}>
                              <td>
                                <div className="admin-category-name">
                                  {category.name}
                                </div>
                              </td>
                              <td>
                                <span className="admin-category-parent">
                                  {category.parentCategory || "-"}
                                </span>
                              </td>
                              <td>
                                <span className="admin-category-sort">
                                  {category.sortOrder}
                                </span>
                              </td>
                              <td>
                                <span className="admin-category-count">
                                  {category.productCount}개
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
                                    onClick={() => handleDeleteCategory(category.id)}
                                  >
                                    삭제
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
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


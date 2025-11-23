import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHeader.css";

function AdminHeader({ isSidebarOpen, onToggleSidebar }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 사용자 정보 로드
  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error("사용자 정보 파싱 오류:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          className="admin-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="사이드바 토글"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1
          className="admin-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          COMMON UNIQUE
        </h1>
        <h2 className="admin-console-title">Admin Console</h2>
      </div>
      <div className="admin-header-right">
        {user && (
          <>
            <span className="admin-user-name">{user.name || user.email}</span>
            <button className="admin-logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;


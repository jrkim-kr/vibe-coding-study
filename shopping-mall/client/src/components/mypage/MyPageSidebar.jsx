import { useNavigate, useLocation } from "react-router-dom";
import "./MyPageSidebar.css";

function MyPageSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/mypage", label: "마이페이지", exact: true },
    { path: "/mypage/orders", label: "주문 내역" },
    { path: "/mypage/profile", label: "회원 정보" },
    { path: "/mypage/addresses", label: "배송지 관리" },
    { path: "/mypage/reviews", label: "리뷰 관리" },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside className="mypage-sidebar">
      <h2 className="mypage-sidebar-title">MY PAGE</h2>
      <nav className="mypage-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            type="button"
            className={`mypage-nav-item ${isActive(item) ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default MyPageSidebar;


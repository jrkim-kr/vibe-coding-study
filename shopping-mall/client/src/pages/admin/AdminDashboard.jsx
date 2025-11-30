import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import KPICard from "../../components/admin/KPICard";
import RecentSales from "../../components/admin/RecentSales";
import "./AdminDashboard.css";

function AdminDashboard() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
            <h2 className="admin-page-title">Dashboard</h2>
            <p className="admin-page-subtitle">
              Overview of your store's performance
            </p>
          </div>

          <div className="admin-kpi-grid">
            <KPICard
              title="Total Revenue"
              value="₩ 45,231,890"
              change="+20.1% from last month"
              trend="up"
              icon="dollar"
            />
            <KPICard
              title="Orders"
              value="+2350"
              change="+180.1% from last month"
              trend="up"
              icon="calendar"
            />
            <KPICard
              title="Active Now"
              value="+573"
              change="+201 since last hour"
              trend="up"
              icon="chart"
            />
            <KPICard
              title="Total Customers"
              value="12,234"
              change="+19% from last month"
              trend="up"
              icon="users"
            />
          </div>

          <div className="admin-charts-grid">
            <div className="admin-chart-card">
              <h3 className="admin-chart-title">Recent Revenue</h3>
              <div className="admin-chart-placeholder">
                Chart Placeholder (Revenue over time)
              </div>
            </div>

            <div className="admin-sales-card">
              <h3 className="admin-chart-title">Recent Sales</h3>
              <RecentSales />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;


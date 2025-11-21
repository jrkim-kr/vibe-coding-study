import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import KPICard from "../components/KPICard";
import RecentSales from "../components/RecentSales";
import "./AdminDashboard.css";

function AdminDashboard() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("dashboard");

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


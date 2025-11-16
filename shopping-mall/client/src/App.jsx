import { useState, useEffect } from "react";
import "./App.css";

// API 기본 URL 설정 (환경변수에서 가져오기)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function App() {
  const [status, setStatus] = useState("loading");
  const [serverStatus, setServerStatus] = useState(null);

  // 서버 상태 확인
  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        setServerStatus(data);
        setStatus("connected");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("서버 연결 실패:", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Shopping Mall</h1>
        <p className="subtitle">쇼핑몰 프론트엔드 애플리케이션</p>
      </header>

      <main className="main-content">
        <div className="status-section">
          <h2 className="section-title">서버 연결 상태</h2>
          {status === "loading" && (
            <div className="status-message loading">연결 중...</div>
          )}
          {status === "connected" && serverStatus && (
            <div className="status-message success">
              <div className="status-item">
                <span className="status-label">서버 상태:</span>
                <span className="status-value">{serverStatus.status}</span>
              </div>
              <div className="status-item">
                <span className="status-label">데이터베이스:</span>
                <span className="status-value">{serverStatus.database}</span>
              </div>
            </div>
          )}
          {status === "error" && (
            <div className="status-message error">
              서버에 연결할 수 없습니다.
              <br />
              <small>백엔드 서버가 실행 중인지 확인해주세요.</small>
            </div>
          )}
        </div>

        <div className="info-section">
          <h2 className="section-title">프로젝트 정보</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">⚛️</div>
              <div className="info-title">React</div>
              <div className="info-description">사용자 인터페이스 구축</div>
            </div>
            <div className="info-card">
              <div className="info-icon">⚡</div>
              <div className="info-title">Vite</div>
              <div className="info-description">빠른 개발 환경</div>
            </div>
            <div className="info-card">
              <div className="info-icon">🚀</div>
              <div className="info-title">Express</div>
              <div className="info-description">백엔드 API 서버</div>
            </div>
            <div className="info-card">
              <div className="info-icon">🍃</div>
              <div className="info-title">MongoDB</div>
              <div className="info-description">데이터베이스</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

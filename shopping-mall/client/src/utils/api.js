/**
 * API 호출 유틸리티
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * 인증 토큰 가져오기
 */
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

/**
 * API 요청 헬퍼 함수
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  // 디버깅: 토큰 확인
  if (!token) {
    console.warn("API 요청: 토큰이 없습니다.", endpoint);
  }

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // 디버깅: 에러 응답 로깅
      console.error("API 에러 응답:", {
        endpoint,
        status: response.status,
        data,
        hasToken: !!token,
      });

      // 401 Unauthorized인 경우
      if (response.status === 401) {
        // 토큰 만료인 경우 자동 갱신 시도
        if (data.error && (data.error.includes("만료") || data.error.includes("expired"))) {
          try {
            const refreshResponse = await fetch(`${API_BASE_URL}/api/users/token/refresh`, {
              method: "POST",
              credentials: "include", // 쿠키 포함
            });
            
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              // 새 토큰 저장
              localStorage.setItem("authToken", refreshData.token);
              // 원래 요청 재시도
              const retryConfig = {
                ...config,
                headers: {
                  ...config.headers,
                  Authorization: `Bearer ${refreshData.token}`,
                },
              };
              const retryResponse = await fetch(url, retryConfig);
              const retryData = await retryResponse.json();
              
              if (!retryResponse.ok) {
                throw new Error(retryData.error || "요청 처리 중 오류가 발생했습니다.");
              }
              
              return retryData;
            }
          } catch (refreshError) {
            console.error("토큰 갱신 실패:", refreshError);
          }
        }
        
        // 토큰 갱신 실패 또는 다른 인증 오류인 경우
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        
        // 관리자 페이지에서는 에러만 던지고, ProtectedRoute가 리다이렉트 처리
        const errorMessage = data.error || "인증이 만료되었습니다. 다시 로그인해주세요.";
        throw new Error(errorMessage);
      }
      // 서버에서 보낸 상세 에러 메시지 사용
      const errorMessage = data.error || data.message || "요청 처리 중 오류가 발생했습니다.";
      const details = data.details || data.errorName || data.errorCode || "";
      const fullErrorMessage = details ? `${errorMessage} (${details})` : errorMessage;
      
      console.error("API 에러 상세:", {
        endpoint,
        status: response.status,
        error: errorMessage,
        details: data.details,
        errorName: data.errorName,
        errorCode: data.errorCode,
        fullData: data,
      });
      throw new Error(fullErrorMessage);
    }

    return data;
  } catch (error) {
    // 네트워크 오류나 파싱 오류인 경우
    if (error instanceof TypeError) {
      console.error("API 네트워크 오류:", error);
      throw new Error("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
    }
    console.error("API 요청 오류:", error);
    throw error;
  }
};

// 상품 관리 API
export const productAPI = {
  // 상품 목록 조회
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.category) queryParams.append("category", params.category);
    if (params.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    return apiRequest(
      `/api/admin/products${queryString ? `?${queryString}` : ""}`
    );
  },

  // 상품 상세 조회
  getProductById: async (id) => {
    return apiRequest(`/api/admin/products/${id}`);
  },

  // 상품 등록
  createProduct: async (productData) => {
    return apiRequest("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  // 상품 수정
  updateProduct: async (id, productData) => {
    return apiRequest(`/api/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  // 상품 삭제
  deleteProduct: async (id) => {
    return apiRequest(`/api/admin/products/${id}`, {
      method: "DELETE",
    });
  },
};

// 주문 관리 API
export const orderAPI = {
  // 주문 목록 조회
  getOrders: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);
    if (params.date) queryParams.append("date", params.date);

    const queryString = queryParams.toString();
    return apiRequest(
      `/api/admin/orders${queryString ? `?${queryString}` : ""}`
    );
  },

  // 주문 상세 조회
  getOrderById: async (id) => {
    return apiRequest(`/api/admin/orders/${id}`);
  },

  // 배송 상태 변경
  updateOrderStatus: async (id, shippingStatus) => {
    return apiRequest(`/api/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ shippingStatus }),
    });
  },
};

// 카테고리 관리 API
export const categoryAPI = {
  // 카테고리 목록 조회
  getCategories: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    return apiRequest(
      `/api/admin/categories${queryString ? `?${queryString}` : ""}`
    );
  },

  // 카테고리 상세 조회
  getCategoryById: async (id) => {
    return apiRequest(`/api/admin/categories/${id}`);
  },

  // 카테고리 등록
  createCategory: async (categoryData) => {
    return apiRequest("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  },

  // 카테고리 수정
  updateCategory: async (id, categoryData) => {
    return apiRequest(`/api/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  },

  // 카테고리 삭제
  deleteCategory: async (id) => {
    return apiRequest(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });
  },
};

// 회원 관리 API
export const customerAPI = {
  // 회원 목록 조회
  getCustomers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    return apiRequest(
      `/api/admin/customers${queryString ? `?${queryString}` : ""}`
    );
  },

  // 회원 상세 조회
  getCustomerById: async (id) => {
    return apiRequest(`/api/admin/customers/${id}`);
  },

  // 회원 상태 변경
  updateCustomerStatus: async (id, status) => {
    return apiRequest(`/api/admin/customers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

// 대시보드 API
export const adminAPI = {
  // 대시보드 통계
  getDashboardStats: async () => {
    return apiRequest("/api/admin/dashboard/stats");
  },

  // 최근 매출 추이
  getRecentRevenue: async (days = 30) => {
    return apiRequest(`/api/admin/dashboard/revenue?days=${days}`);
  },

  // 최근 판매 내역
  getRecentSales: async (limit = 10) => {
    return apiRequest(`/api/admin/dashboard/sales?limit=${limit}`);
  },
};

// 메인 페이지 등에서 사용하는 공개 상품 조회 API
export const publicProductAPI = {
  // 공개용 상품 목록 조회
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.category) queryParams.append("category", params.category);
    if (params.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    return apiRequest(
      `/api/products${queryString ? `?${queryString}` : ""}`
    );
  },

  // 공개용 상품 상세 조회
  getProductById: async (id) => {
    return apiRequest(`/api/products/${id}`);
  },
};

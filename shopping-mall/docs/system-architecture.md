# 시스템 아키텍처

## 1. 전체 아키텍처 개요

```
┌─────────────────┐
│   사용자 브라우저  │
└────────┬────────┘
         │ HTTP/HTTPS
         │
┌────────▼────────┐
│  React Client   │  (Vite + React)
│  (Port 5173)    │
└────────┬────────┘
         │ REST API
         │
┌────────▼────────┐
│ Express Server  │  (Node.js + Express)
│  (Port 5000)    │
└────────┬────────┘
         │
┌────────▼────────┐
│    MongoDB      │  (Database)
│  (Port 27017)   │
└─────────────────┘
```

## 2. 프론트엔드 아키텍처

### 2.1 기술 스택

- **React 18** - 컴포넌트 기반 UI 라이브러리
- **React Router** - 클라이언트 사이드 라우팅
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **Cloudinary** - 이미지 업로드 및 CDN

### 2.2 디렉토리 구조

```
client/src/
├── pages/              # 페이지 컴포넌트
│   ├── MainPage.jsx    # 메인 페이지
│   ├── LoginPage.jsx   # 로그인
│   ├── RegisterPage.jsx # 회원가입
│   └── Admin*.jsx      # 관리자 페이지들
│
├── components/          # 재사용 컴포넌트
│   ├── ProductCard.jsx # 상품 카드
│   ├── ImageUploader.jsx # 이미지 업로더
│   └── AdminSidebar.jsx # 관리자 사이드바
│
├── utils/              # 유틸리티 함수
│   └── cloudinary.js   # Cloudinary 업로드
│
├── App.jsx             # 메인 앱 컴포넌트
└── main.jsx            # 진입점
```

### 2.3 라우팅 구조

```
/                    → MainPage
/login               → LoginPage
/register            → RegisterPage
/admin               → AdminDashboard
/admin/products      → AdminProducts
/admin/orders        → AdminOrders
/admin/categories    → AdminCategories
/admin/customers      → AdminCustomers
```

### 2.4 상태 관리

현재는 React의 `useState`와 `useEffect`를 사용한 로컬 상태 관리만 사용합니다.
향후 복잡한 상태 관리가 필요하면 Context API나 Redux를 도입할 수 있습니다.

## 3. 백엔드 아키텍처

### 3.1 기술 스택

- **Node.js** - JavaScript 런타임
- **Express** - 웹 프레임워크
- **MongoDB** - NoSQL 데이터베이스
- **Mongoose** - MongoDB ODM
- **JWT** - 인증 토큰
- **bcrypt** - 비밀번호 해싱

### 3.2 디렉토리 구조

```
server/src/
├── models/            # 데이터베이스 모델
│   ├── User.js       # 사용자 모델
│   ├── Product.js    # 상품 모델
│   ├── Category.js   # 카테고리 모델
│   └── Order.js      # 주문 모델
│
├── controllers/       # 비즈니스 로직
│   ├── userController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── orderController.js
│   ├── customerController.js
│   └── adminController.js
│
├── routes/            # API 라우트
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   ├── orderRoutes.js
│   ├── customerRoutes.js
│   └── adminRoutes.js
│
├── middleware/        # 미들웨어
│   └── auth.js       # 인증 및 권한 확인
│
└── index.js          # 서버 진입점
```

### 3.3 API 구조

```
/api
├── /users            # 사용자 API
│   ├── POST /register
│   ├── POST /login
│   ├── POST /token/refresh
│   └── POST /logout
│
└── /admin            # 관리자 API (인증 필요)
    ├── /dashboard    # 대시보드
    ├── /products     # 상품 관리
    ├── /orders       # 주문 관리
    ├── /categories   # 카테고리 관리
    └── /customers    # 회원 관리
```

## 4. 데이터베이스 설계

### 4.1 컬렉션 구조

```
MongoDB
├── users             # 사용자 및 관리자
├── products           # 상품
├── categories         # 카테고리
├── orders             # 주문
├── carts              # 장바구니 (향후 구현)
└── reviews            # 리뷰 (향후 구현)
```

### 4.2 관계도

```
User (1) ──< (N) Order
User (1) ──< (N) Cart (향후)
User (1) ──< (N) Review (향후)

Category (1) ──< (N) Product
Category (1) ──< (N) Category (self-reference)

Product (1) ──< (N) OrderItem
Product (1) ──< (N) Review (향후)
```

### 4.3 인덱스 전략

- `users.email`: unique index
- `products.category`: index
- `products.name`: text index (검색용)
- `orders.userId + createdAt`: compound index
- `orders.orderNumber`: unique index

## 5. 인증 및 보안

### 5.1 인증 흐름

```
1. 사용자 로그인
   ↓
2. 서버에서 JWT Access Token + Refresh Token 발급
   ↓
3. 클라이언트에 토큰 저장 (LocalStorage)
   ↓
4. API 요청 시 Authorization 헤더에 토큰 포함
   ↓
5. 서버에서 토큰 검증 (authenticate 미들웨어)
   ↓
6. 관리자 API는 추가로 requireAdmin 미들웨어 통과
```

### 5.2 보안 조치

- 비밀번호: bcrypt 해싱 (salt rounds: 10)
- JWT: 서명 검증 및 만료 시간 확인
- CORS: 프론트엔드 도메인만 허용
- 입력 검증: Mongoose 스키마 검증
- Soft Delete: 데이터 완전 삭제 대신 isDeleted 플래그 사용

## 6. 이미지 업로드 아키텍처

### 6.1 Cloudinary 통합

```
클라이언트
  ↓
1. 파일 선택
  ↓
2. Cloudinary에 직접 업로드 (Unsigned Upload Preset)
  ↓
3. 업로드된 이미지 URL 반환
  ↓
4. 상품 등록 시 URL 저장
```

### 6.2 업로드 프로세스

1. 사용자가 이미지 파일 선택
2. `ImageUploader` 컴포넌트가 파일을 받음
3. `uploadImageToCloudinary` 함수로 Cloudinary에 업로드
4. 진행률 표시 및 미리보기
5. 업로드 완료 후 URL을 부모 컴포넌트에 전달

## 7. 데이터 흐름

### 7.1 관리자 상품 등록 흐름

```
AdminProducts 페이지
  ↓
ProductModal 열기
  ↓
ImageUploader로 이미지 업로드
  ↓
Cloudinary에 업로드
  ↓
이미지 URL 받기
  ↓
상품 정보와 함께 POST /api/admin/products
  ↓
서버에서 검증 및 저장
  ↓
응답 반환 및 목록 갱신
```

### 7.2 주문 상태 변경 흐름

```
AdminOrders 페이지
  ↓
배송 상태 드롭다운 변경
  ↓
PATCH /api/admin/orders/:id/status
  ↓
서버에서 상태 업데이트
  ↓
응답 반환 및 UI 갱신
```

## 8. 에러 처리

### 8.1 프론트엔드

- API 호출 실패 시 사용자에게 알림 표시
- 네트워크 오류 처리
- 유효성 검증 오류 표시

### 8.2 백엔드

- Express 에러 핸들링 미들웨어
- 일관된 에러 응답 형식
- 로깅 (향후 추가 예정)

## 9. 성능 최적화

### 9.1 프론트엔드

- 이미지 Lazy Loading
- 컴포넌트 코드 스플리팅 (향후)
- React.memo 사용 (필요 시)

### 9.2 백엔드

- 데이터베이스 인덱스 활용
- 페이지네이션으로 대량 데이터 처리
- populate 최적화

## 10. 배포 아키텍처 (향후)

```
┌─────────────┐
│   CDN       │  (정적 파일)
└─────────────┘
       │
┌──────▼──────┐
│   Frontend  │  (Vercel/Netlify)
└──────┬──────┘
       │
┌──────▼──────┐
│   Backend   │  (AWS/Railway/Heroku)
└──────┬──────┘
       │
┌──────▼──────┐
│  MongoDB    │  (MongoDB Atlas)
└─────────────┘
```

## 11. 향후 개선 사항

1. **상태 관리**: Context API 또는 Redux 도입
2. **캐싱**: Redis 도입 검토
3. **로깅**: Winston 또는 Morgan 도입
4. **테스트**: Jest + React Testing Library
5. **CI/CD**: GitHub Actions 설정
6. **모니터링**: 에러 추적 및 성능 모니터링 도구 도입

---

**문서 버전:** 1.0  
**최종 업데이트:** 2025-01-22

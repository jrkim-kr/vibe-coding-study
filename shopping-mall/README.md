# Shoppping Mall Demo MVP

Shoppping Mall Demo의 핵심 기능을 구현한 MVP(Minimum Viable Product) 프로젝트입니다.

## 📋 프로젝트 개요

이 프로젝트는 React + Vite 프론트엔드와 Node.js + Express + MongoDB 백엔드로 구성된 풀스택 Shoppping Mall Demo 애플리케이션입니다.

### 주요 기능

#### 사용자 기능

- ✅ 회원가입/로그인/로그아웃 (JWT 기반 인증)
- ✅ 회원 정보 조회/수정
- ✅ 배송지 관리 (추가/수정/삭제, 기본 배송지 설정)
- ✅ 상품 조회 (목록, 상세, 카테고리별)
- ✅ 장바구니 (추가/수정/삭제, 수량 변경)
- ✅ 주문 및 결제 (포트원 연동)
- ✅ 주문 내역 조회
- ✅ 상품 디테일 페이지 BUY NOW 기능

#### 관리자 기능

- ✅ 관리자 대시보드 (매출 통계, 주문 현황)
- ✅ 상품 관리 (등록/수정/삭제, Cloudinary 이미지 업로드)
- ✅ 카테고리 관리 (계층 구조 지원)
- ✅ 주문 관리 (주문 목록, 배송 상태 변경)
- ✅ 회원 관리 (회원 목록, 통계)

### 향후 구현 예정

- 상품 검색 및 정렬
- 리뷰 시스템 (API 연동)
- 주문 취소 기능
- 비밀번호 변경 및 회원탈퇴

## 🏗️ 프로젝트 구조

```
shopping-mall/
├── client/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/    # 재사용 가능한 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── utils/         # 유틸리티 함수
│   │   └── data/          # 정적 데이터
│   └── package.json
│
├── server/                # Node.js 백엔드
│   ├── src/
│   │   ├── controllers/  # 컨트롤러
│   │   ├── models/       # Mongoose 모델
│   │   ├── routes/       # 라우트 정의
│   │   ├── middleware/   # 미들웨어
│   │   └── index.js      # 서버 진입점
│   └── package.json
│
└── docs/
    ├── requirements.md
    ├── feature-spec.md
    ├── database-schema.md
    ├── implementation-status.md
    └── system-architecture.md
```

## 🚀 시작하기

### 사전 요구사항

- Node.js (v18 이상)
- MongoDB (로컬 또는 MongoDB Atlas)
- npm 또는 yarn

### 설치 및 실행

#### 1. 프론트엔드 설정

```bash
cd client
npm install
cp env.example .env
# .env 파일에 Cloudinary 설정 추가
npm run dev
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

#### 2. 백엔드 설정

```bash
cd server
npm install
cp env.example .env
# .env 파일에 MongoDB URI 및 JWT Secret 설정
npm run dev
```

백엔드는 `http://localhost:5000`에서 실행됩니다.

### 환경 변수 설정

#### 프론트엔드 (.env)

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

#### 백엔드 (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopping-mall-db
# 또는 MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopping-mall-demo

JWT_SECRET=your-secret-key
ACCESS_TOKEN_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# 포트원(아임포트) 결제 게이트웨이
PORTONE_REST_API_KEY=your-portone-rest-api-key
PORTONE_REST_API_SECRET=your-portone-rest-api-secret

# Cloudinary (이미지 관리)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

## 📚 문서

- [구현 현황](./docs/implementation-status.md) - 기능별 구현 상태
- [요구사항 정의서](./docs/requirements.md) - 프로젝트 요구사항 및 범위
- [기능 명세서](./docs/feature-spec.md) - 상세 기능 동작 명세
- [데이터베이스 설계서](./docs/database-schema.md) - 데이터베이스 스키마 설계
- [시스템 아키텍처](./docs/system-architecture.md) - 시스템 아키텍처 및 구조
- [REST API 명세서](./docs/rest-api-spec.md) - 전체 API 문서 (사용자 + 관리자)
- [배포 환경 설정 가이드](./docs/deployment-config.md) - 배포 환경 설정 및 배포 순서

## 🛠️ 기술 스택

### 프론트엔드

- **React 18** - UI 라이브러리
- **React Router** - 라우팅
- **Vite** - 빌드 도구
- **Cloudinary** - 이미지 업로드 및 관리

### 백엔드

- **Node.js** - 런타임 환경
- **Express** - 웹 프레임워크
- **MongoDB** - NoSQL 데이터베이스
- **Mongoose** - MongoDB ODM
- **JWT** - 인증 토큰
- **bcrypt** - 비밀번호 암호화

## 📁 주요 디렉토리 설명

### 프론트엔드 (client/)

- `src/pages/` - 페이지 컴포넌트

  - `MainPage.jsx` - 메인 페이지
  - `LoginPage.jsx` - 로그인 페이지
  - `RegisterPage.jsx` - 회원가입 페이지
  - `ProductDetailPage.jsx` - 상품 상세 페이지
  - `CartPage.jsx` - 장바구니 페이지
  - `OrderPage.jsx` - 주문 페이지
  - `OrderCompletePage.jsx` - 주문 완료 페이지
  - `MyPage.jsx` - 마이페이지
  - `MyOrdersPage.jsx` - 주문 내역 페이지
  - `MyOrderDetailPage.jsx` - 주문 상세 페이지
  - `MyProfilePage.jsx` - 회원 정보 수정 페이지
  - `MyAddressesPage.jsx` - 배송지 관리 페이지
  - `MyReviewsPage.jsx` - 리뷰 관리 페이지
  - `AdminDashboard.jsx` - 관리자 대시보드
  - `AdminProducts.jsx` - 상품 관리
  - `AdminOrders.jsx` - 주문 관리
  - `AdminCategories.jsx` - 카테고리 관리
  - `AdminCustomers.jsx` - 회원 관리

- `src/components/` - 재사용 컴포넌트

  - `ImageUploader.jsx` - Cloudinary 이미지 업로드
  - `ProductModal.jsx` - 상품 등록/수정 모달
  - `CategoryModal.jsx` - 카테고리 등록/수정 모달

- `src/utils/` - 유틸리티
  - `api.js` - API 호출 유틸리티
  - `cloudinary.js` - Cloudinary 업로드 함수
  - `cart.js` - 장바구니 로컬 스토리지 관리

### 백엔드 (server/)

- `src/models/` - 데이터베이스 모델

  - `User.js` - 사용자 모델
  - `Product.js` - 상품 모델
  - `Category.js` - 카테고리 모델
  - `Order.js` - 주문 모델

- `src/controllers/` - 비즈니스 로직

  - `authController.js` - 인증 (회원가입, 로그인, 프로필 관리, 배송지 관리)
  - `productController.js` - 상품 관리
  - `categoryController.js` - 카테고리 관리
  - `adminOrderController.js` - 관리자 주문 관리
  - `customerOrderController.js` - 사용자 주문 관리
  - `customerController.js` - 회원 관리
  - `adminController.js` - 대시보드 통계
  - `cartController.js` - 장바구니 관리
  - `paymentController.js` - 결제 검증

- `src/routes/` - API 라우트
  - `userRoutes.js` - 사용자 API (회원가입, 로그인, 프로필, 배송지)
  - `publicProductRoutes.js` - 공개 상품 API
  - `cartRoutes.js` - 장바구니 API
  - `userOrderRoutes.js` - 사용자 주문 API
  - `paymentRoutes.js` - 결제 API
  - `adminRoutes.js` - 관리자 대시보드
  - `productRoutes.js` - 관리자 상품 관리
  - `orderRoutes.js` - 관리자 주문 관리
  - `categoryRoutes.js` - 관리자 카테고리 관리
  - `customerRoutes.js` - 관리자 회원 관리
- `src/middleware/` - 미들웨어
  - `auth.js` - 인증 및 권한 확인

## 🔐 인증 및 권한

### 사용자 인증

- JWT 기반 인증
- Access Token + Refresh Token 방식
- Access Token: 24시간 만료 (개발 환경)
- Refresh Token: 7일 만료
- Refresh Token은 HttpOnly 쿠키에 저장

### 관리자 권한

모든 관리자 API는 다음 미들웨어를 통과해야 합니다:

1. `authenticate` - JWT 토큰 검증
2. `requireAdmin` - 관리자 권한 확인

## 📡 API 엔드포인트

### 사용자 API

- `POST /api/users/register` - 회원가입
- `POST /api/users/login` - 로그인
- `POST /api/users/token/refresh` - 토큰 갱신
- `POST /api/users/logout` - 로그아웃
- `GET /api/users/me` - 현재 사용자 정보 조회 (인증 필요)
- `PUT /api/users/me` - 사용자 프로필 업데이트 (인증 필요)
- `GET /api/users/me/addresses` - 배송지 목록 조회 (인증 필요)
- `POST /api/users/me/addresses` - 배송지 추가 (인증 필요)
- `PUT /api/users/me/addresses/:id` - 배송지 수정 (인증 필요)
- `DELETE /api/users/me/addresses/:id` - 배송지 삭제 (인증 필요)

### 공개 API

- `GET /api/products` - 상품 목록 조회
- `GET /api/products/:id` - 상품 상세 조회

### 장바구니 API (인증 필요)

- `GET /api/cart` - 장바구니 조회
- `POST /api/cart/items` - 상품 추가
- `PATCH /api/cart/items/:id` - 수량 변경
- `DELETE /api/cart/items/:id` - 상품 삭제
- `DELETE /api/cart` - 장바구니 비우기

### 주문 API (인증 필요)

- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:id` - 주문 상세 조회
- `POST /api/orders` - 주문 생성

### 결제 API (인증 필요)

- `POST /api/payments/verify` - 결제 검증

### 관리자 API

자세한 내용은 [REST API 명세서](./docs/rest-api-spec.md)를 참고하세요.

- `GET /api/admin/dashboard/stats` - 대시보드 통계
- `GET /api/admin/products` - 상품 목록
- `POST /api/admin/products` - 상품 등록
- `GET /api/admin/orders` - 주문 목록
- `PATCH /api/admin/orders/:id/status` - 배송 상태 변경
- `GET /api/admin/categories` - 카테고리 목록
- `GET /api/admin/customers` - 회원 목록

## 🧪 테스트

현재 테스트 코드는 포함되어 있지 않습니다. 향후 추가 예정입니다.

## 📝 개발 가이드

### 코드 스타일

- JavaScript/JSX 파일은 ES6+ 문법 사용
- 컴포넌트는 함수형 컴포넌트 사용
- CSS는 모듈화된 스타일 파일 사용

### 커밋 메시지

커밋 메시지는 다음과 같은 형식을 따릅니다:

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 설정 등
```

## 🤝 기여하기

1. 이슈를 생성하거나 기존 이슈를 확인하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋하세요 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.

## 👥 팀

- 개발자: [이름]

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

## 🌐 배포

프로젝트는 다음 환경에 배포되어 있습니다:

- **프론트엔드**: [Vercel](https://shopping-mall-demo-fe.vercel.app/)
- **백엔드**: [Cloudtype](https://port-0-shopping-mall-demo-be-milmit5ve61b6a6d.sel3.cloudtype.app/)
- **데이터베이스**: MongoDB Atlas

배포 설정 및 환경 변수 설정은 [배포 환경 설정 가이드](./docs/deployment-config.md)를 참고하세요.

---

**마지막 업데이트:** 2025-01-22

# Shoppping Mall Demo Backend API

Node.js, Express, MongoDB를 사용한 Shoppping Mall Demo 백엔드 API 서버입니다.

## 기술 스택

- **Node.js**: JavaScript 런타임
- **Express**: 웹 프레임워크
- **MongoDB**: NoSQL 데이터베이스
- **Mongoose**: MongoDB ODM
- **JWT**: 인증 토큰
- **bcrypt**: 비밀번호 암호화

## 설치 방법

1. 의존성 설치:

```bash
npm install
```

2. 환경 변수 설정:

```bash
cp env.example .env
```

3. `.env` 파일을 열어 MongoDB 및 JWT 설정을 구성하세요.

## 실행 방법

### 개발 모드 (자동 재시작)

```bash
npm run dev
```

### 프로덕션 모드

```bash
npm start
```

## 환경 변수

`.env` 파일에서 다음 값을 설정할 수 있습니다.

| 변수                       | 설명                               | 기본값                                       |
| -------------------------- | ---------------------------------- | -------------------------------------------- |
| `PORT`                     | 서버 포트                          | `5000`                                       |
| `MONGODB_URI`              | MongoDB 연결 URI                   | `mongodb://localhost:27017/shopping-mall-db` |
| `JWT_SECRET`               | JWT 서명 시크릿                    | `change-me`                                  |
| `ACCESS_TOKEN_EXPIRES_IN`  | Access Token 만료 시간 (예: `24h`) | `24h`                                        |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh Token 만료 시간 (예: `7d`) | `7d`                                         |
| `PORTONE_REST_API_KEY`     | 포트원 REST API Key                | -                                            |
| `PORTONE_REST_API_SECRET`  | 포트원 REST API Secret             | -                                            |
| `CLOUDINARY_CLOUD_NAME`    | Cloudinary Cloud Name              | -                                            |
| `CLOUDINARY_API_KEY`       | Cloudinary API Key                 | -                                            |
| `CLOUDINARY_API_SECRET`    | Cloudinary API Secret              | -                                            |

## API 엔드포인트

### 사용자 API

- `POST /api/users/register` - 이메일 기반 회원가입
- `POST /api/users/login` - 이메일/비밀번호 로그인
- `POST /api/users/token/refresh` - Refresh Token으로 Access Token 재발급
- `POST /api/users/logout` - 로그아웃
- `GET /api/users/me` - 현재 사용자 정보 조회 (인증 필요)
- `PUT /api/users/me` - 사용자 프로필 업데이트 (인증 필요)
- `GET /api/users/me/addresses` - 배송지 목록 조회 (인증 필요)
- `POST /api/users/me/addresses` - 배송지 추가 (인증 필요)
- `PUT /api/users/me/addresses/:id` - 배송지 수정 (인증 필요)
- `DELETE /api/users/me/addresses/:id` - 배송지 삭제 (인증 필요)

### 공개 상품 API

- `GET /api/products` - 상품 목록 조회
- `GET /api/products/:id` - 상품 상세 조회

### 장바구니 API (인증 필요)

- `GET /api/cart` - 장바구니 조회
- `POST /api/cart/items` - 상품 추가
- `PATCH /api/cart/items/:id` - 수량 변경
- `DELETE /api/cart/items/:id` - 상품 삭제
- `DELETE /api/cart` - 장바구니 비우기

### 사용자 주문 API (인증 필요)

- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:id` - 주문 상세 조회
- `POST /api/orders` - 주문 생성

### 결제 API (인증 필요)

- `POST /api/payments/verify` - 결제 검증 (포트원)

### 관리자 API

자세한 내용은 [REST API 명세서](../docs/rest-api-spec.md)를 참고하세요.

#### 대시보드

- `GET /api/admin/dashboard/stats` - 대시보드 통계
- `GET /api/admin/dashboard/revenue` - 최근 매출 추이
- `GET /api/admin/dashboard/sales` - 최근 판매 내역

#### 상품 관리

- `GET /api/admin/products` - 상품 목록 조회
- `GET /api/admin/products/:id` - 상품 상세 조회
- `POST /api/admin/products` - 상품 등록
- `PUT /api/admin/products/:id` - 상품 수정
- `DELETE /api/admin/products/:id` - 상품 삭제

#### 주문 관리

- `GET /api/admin/orders` - 주문 목록 조회
- `GET /api/admin/orders/:id` - 주문 상세 조회
- `PATCH /api/admin/orders/:id/status` - 배송 상태 변경

#### 카테고리 관리

- `GET /api/admin/categories` - 카테고리 목록 조회
- `GET /api/admin/categories/:id` - 카테고리 상세 조회
- `POST /api/admin/categories` - 카테고리 등록
- `PUT /api/admin/categories/:id` - 카테고리 수정
- `DELETE /api/admin/categories/:id` - 카테고리 삭제

#### 회원 관리

- `GET /api/admin/customers` - 회원 목록 조회
- `GET /api/admin/customers/:id` - 회원 상세 조회
- `PATCH /api/admin/customers/:id/status` - 회원 상태 변경

### 기타

- `GET /` - API 상태 확인
- `GET /health` - 서버 및 데이터베이스 상태 확인

## 프로젝트 구조

```
server/
├── src/
│   ├── controllers/     # 비즈니스 로직
│   │   ├── authController.js      # 인증 (회원가입, 로그인, 프로필, 배송지)
│   │   ├── productController.js   # 상품 관리
│   │   ├── categoryController.js  # 카테고리 관리
│   │   ├── adminOrderController.js # 관리자 주문 관리
│   │   ├── customerOrderController.js # 사용자 주문 관리
│   │   ├── customerController.js  # 회원 관리
│   │   ├── adminController.js     # 대시보드 통계
│   │   ├── cartController.js       # 장바구니 관리
│   │   └── paymentController.js    # 결제 검증
│   │
│   ├── models/          # 데이터베이스 모델
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   └── RefreshToken.js
│   │
│   ├── routes/          # API 라우트
│   │   ├── userRoutes.js           # 사용자 API
│   │   ├── publicProductRoutes.js  # 공개 상품 API
│   │   ├── cartRoutes.js           # 장바구니 API
│   │   ├── userOrderRoutes.js      # 사용자 주문 API
│   │   ├── paymentRoutes.js        # 결제 API
│   │   ├── adminRoutes.js          # 관리자 대시보드
│   │   ├── productRoutes.js        # 관리자 상품 관리
│   │   ├── orderRoutes.js          # 관리자 주문 관리
│   │   ├── categoryRoutes.js       # 관리자 카테고리 관리
│   │   └── customerRoutes.js       # 관리자 회원 관리
│   │
│   ├── middleware/      # 미들웨어
│   │   └── auth.js
│   │
│   └── index.js         # 메인 서버 파일
│
├── .env.example         # 환경 변수 예제
├── .gitignore
├── package.json
└── README.md
```

## 인증 및 권한

### JWT 토큰

모든 관리자 API는 인증이 필요합니다. 요청 헤더에 다음을 포함하세요:

```
Authorization: Bearer <ACCESS_TOKEN>
```

### 관리자 권한

관리자 API는 `role: "admin"`인 사용자만 접근 가능합니다.

## MongoDB 연결

### 로컬 MongoDB

로컬 MongoDB를 사용하는 경우:

- MongoDB가 실행 중이어야 합니다.
- 기본 연결 URI: `mongodb://localhost:27017/shopping-mall-db`

### MongoDB Atlas

MongoDB Atlas를 사용하는 경우:

- `.env` 파일에 Atlas 연결 문자열을 설정하세요.
- 예: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopping-mall-demo`
- MongoDB Atlas의 Network Access에서 접근 IP 주소 허용 필요
- Database Access에서 사용자 생성 및 권한 설정 필요

**현재 배포 환경:**

- MongoDB Atlas 클라우드 데이터베이스 사용

## 데이터 모델

### User (사용자)

- 이메일, 비밀번호, 이름, 전화번호
- 역할 (user/admin)
- 배송지 정보
- Soft delete 지원

### Product (상품)

- 상품명, 설명, 가격, 재고
- 카테고리 참조
- 이미지 URL 배열
- 상태 (판매중/판매중지/품절)

### Category (카테고리)

- 카테고리명
- 상위 카테고리 참조 (계층 구조)
- 정렬 순서

### Order (주문)

- 주문번호, 사용자 참조
- 주문 상품 목록 (스냅샷)
- 배송지 정보
- 배송 상태, 결제 상태

## 에러 처리

모든 API는 일관된 에러 응답 형식을 사용합니다:

```json
{
  "error": "에러 메시지",
  "message": "상세 메시지 (선택)"
}
```

HTTP 상태 코드:

- 200: 성공
- 201: 생성 성공
- 400: 잘못된 요청
- 401: 인증 필요
- 403: 권한 없음
- 404: 리소스 없음
- 409: 중복 충돌
- 500: 서버 오류

## 개발 가이드

### 새 컨트롤러 추가

1. `src/controllers/`에 컨트롤러 파일 생성
2. `src/routes/`에 라우트 파일 생성
3. `src/index.js`에 라우트 등록

### 새 모델 추가

1. `src/models/`에 Mongoose 스키마 정의
2. 필요한 인덱스 추가
3. 컨트롤러에서 사용

## 배포

**현재 배포 환경:**

- Cloudtype: https://port-0-shopping-mall-demo-be-milmit5ve61b6a6d.sel3.cloudtype.app/
- MongoDB Atlas 클라우드 데이터베이스

배포 설정 및 환경 변수 설정은 [배포 환경 설정 가이드](../docs/deployment-config.md)를 참고하세요.

## 향후 개선 사항

- [ ] 로깅 시스템 (Winston)
- [ ] 테스트 코드 (Jest)
- [ ] API 문서 자동화 (Swagger)
- [ ] 캐싱 (Redis)
- [ ] 상품 검색 및 정렬 기능
- [ ] 리뷰 시스템 API 구현
- [ ] 주문 취소 기능
- [ ] 비밀번호 변경 및 회원탈퇴 기능

---

**마지막 업데이트:** 2025-01-22

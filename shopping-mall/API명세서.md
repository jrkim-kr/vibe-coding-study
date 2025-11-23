# API 문서

쇼핑몰 백엔드 API의 전체 문서입니다.

## 목차

1. [인증](#인증)
2. [사용자 API](#사용자-api)
3. [관리자 API](#관리자-api)
   - [대시보드](#대시보드)
   - [상품 관리](#상품-관리)
   - [주문 관리](#주문-관리)
   - [카테고리 관리](#카테고리-관리)
   - [회원 관리](#회원-관리)

## 기본 정보

- **Base URL**: `http://localhost:5000`
- **API Prefix**: `/api`
- **Content-Type**: `application/json`

## 인증

대부분의 API는 JWT 토큰 기반 인증을 사용합니다.

### 인증 헤더

```
Authorization: Bearer <ACCESS_TOKEN>
```

### 토큰 발급

로그인 성공 시 다음 토큰이 발급됩니다:

- **Access Token**: 24시간 만료 (API 요청에 사용)
- **Refresh Token**: 7일 만료 (토큰 갱신에 사용)

## 사용자 API

### 회원가입

```
POST /api/users/register
```

**요청 본문:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

**응답 (201):**

```json
{
  "message": "회원가입이 완료되었습니다.",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "user"
  }
}
```

### 로그인

```
POST /api/users/login
```

**요청 본문:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답 (200):**

```json
{
  "message": "로그인 성공",
  "accessToken": "...",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "user"
  }
}
```

### 토큰 갱신

```
POST /api/users/token/refresh
```

**쿠키에 Refresh Token이 포함되어야 합니다.**

**응답 (200):**

```json
{
  "accessToken": "..."
}
```

### 로그아웃

```
POST /api/users/logout
```

**응답 (200):**

```json
{
  "message": "로그아웃되었습니다."
}
```

## 관리자 API

모든 관리자 API는 인증 및 관리자 권한이 필요합니다.

### 대시보드 API

#### 1.1 대시보드 통계 조회

```
GET /api/admin/dashboard/stats
```

**응답:**

```json
{
  "totalRevenue": {
    "value": 45231890,
    "change": "20.1",
    "period": "from last month"
  },
  "orders": {
    "value": 2350,
    "change": "180.1",
    "period": "from last month"
  },
  "activeUsers": {
    "value": 573,
    "change": "0",
    "period": "since last hour"
  },
  "totalCustomers": {
    "value": 12234,
    "change": "19.0",
    "period": "from last month"
  }
}
```

#### 1.2 최근 매출 추이 조회

```
GET /api/admin/dashboard/revenue?days=30
```

**쿼리 파라미터:**

- `days` (선택): 조회할 일수 (기본값: 30)

**응답:**

```json
[
  {
    "date": "2024-01-01",
    "revenue": 1500000
  },
  ...
]
```

#### 1.3 최근 판매 내역 조회

```
GET /api/admin/dashboard/sales?limit=10
```

**쿼리 파라미터:**

- `limit` (선택): 조회할 개수 (기본값: 10)

**응답:**

```json
[
  {
    "id": "...",
    "customerName": "Olivia Martin",
    "customerEmail": "olivia.martin@email.com",
    "amount": 129000,
    "orderDate": "2024-01-15T..."
  },
  ...
]
```

### 상품 관리 API

#### 2.1 상품 목록 조회

```
GET /api/admin/products?page=1&limit=20&search=&category=&status=
```

**쿼리 파라미터:**

- `page` (선택): 페이지 번호 (기본값: 1)
- `limit` (선택): 페이지당 개수 (기본값: 20)
- `search` (선택): 검색어 (상품명)
- `category` (선택): 카테고리명
- `status` (선택): 상태 (판매중/판매중지/품절)

#### 2.2 상품 상세 조회

```
GET /api/admin/products/:id
```

#### 2.3 상품 등록

```
POST /api/admin/products
Content-Type: application/json

{
  "name": "상품명",
  "category": "카테고리명 또는 ID",
  "price": 40900,
  "stock": 15,
  "description": "상품 설명",
  "images": ["https://..."],
  "status": "판매중"
}
```

#### 2.4 상품 수정

```
PUT /api/admin/products/:id
Content-Type: application/json

{
  "name": "수정된 상품명",
  "price": 50000,
  ...
}
```

#### 2.5 상품 삭제

```
DELETE /api/admin/products/:id
```

### 주문 관리 API

#### 3.1 주문 목록 조회

```
GET /api/admin/orders?page=1&limit=20&search=&status=&date=
```

**쿼리 파라미터:**

- `page` (선택): 페이지 번호
- `limit` (선택): 페이지당 개수
- `search` (선택): 검색어 (주문번호, 고객명, 이메일)
- `status` (선택): 배송 상태 (전체/주문접수/배송준비중/배송중/배송완료/취소/반품)
- `date` (선택): 주문일자 (YYYY-MM-DD)

#### 3.2 주문 상세 조회

```
GET /api/admin/orders/:id
```

#### 3.3 배송 상태 변경

```
PATCH /api/admin/orders/:id/status
Content-Type: application/json

{
  "shippingStatus": "배송중"
}
```

**가능한 상태:**

- 주문접수
- 배송준비중
- 배송중
- 배송완료
- 취소
- 반품

### 카테고리 관리 API

#### 4.1 카테고리 목록 조회

```
GET /api/admin/categories?search=
```

**쿼리 파라미터:**

- `search` (선택): 검색어 (카테고리명)

#### 4.2 카테고리 상세 조회

```
GET /api/admin/categories/:id
```

#### 4.3 카테고리 등록

```
POST /api/admin/categories
Content-Type: application/json

{
  "name": "카테고리명",
  "parentCategory": "상위 카테고리 ID 또는 null",
  "sortOrder": 1
}
```

#### 4.4 카테고리 수정

```
PUT /api/admin/categories/:id
Content-Type: application/json

{
  "name": "수정된 카테고리명",
  "sortOrder": 2
}
```

#### 4.5 카테고리 삭제

```
DELETE /api/admin/categories/:id
```

**주의:** 하위 카테고리나 상품이 있는 경우 삭제 불가

### 회원 관리 API

#### 5.1 회원 목록 조회

```
GET /api/admin/customers?page=1&limit=20&search=&status=
```

**쿼리 파라미터:**

- `page` (선택): 페이지 번호
- `limit` (선택): 페이지당 개수
- `search` (선택): 검색어 (이름, 이메일, 전화번호)
- `status` (선택): 상태 (전체/활성/비활성)

#### 5.2 회원 상세 조회

```
GET /api/admin/customers/:id
```

#### 5.3 회원 상태 변경

```
PATCH /api/admin/customers/:id/status
Content-Type: application/json

{
  "status": "활성"
}
```

**가능한 상태:**

- 활성
- 비활성

## 에러 응답

모든 API는 오류 발생 시 다음 형식으로 응답합니다:

```json
{
  "error": "에러 메시지",
  "message": "상세 메시지 (선택)"
}
```

### HTTP 상태 코드

- **200 OK**: 요청 성공
- **201 Created**: 리소스 생성 성공
- **400 Bad Request**: 잘못된 요청
- **401 Unauthorized**: 인증 필요
- **403 Forbidden**: 권한 없음
- **404 Not Found**: 리소스를 찾을 수 없음
- **409 Conflict**: 중복 충돌
- **500 Internal Server Error**: 서버 오류

## 예제

### cURL 예제

#### 로그인

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### 상품 목록 조회 (인증 필요)

```bash
curl -X GET http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

#### 상품 등록

```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "새 상품",
    "category": "아우터",
    "price": 50000,
    "stock": 10,
    "images": ["https://example.com/image.jpg"],
    "status": "판매중"
  }'
```

## 참고 문서

- [서버 README](./server/README.md)
- [아키텍처 문서](./아키텍처구성도.md)

---

**문서 버전:** 1.0  
**최종 업데이트:** 2025-01-22

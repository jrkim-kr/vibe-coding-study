# 데이터베이스설계서

컬렉션 단위: `users`, `categories`, `products`, `carts`, `orders`, `reviews`.

---

## 1. users 컬렉션 (회원 + 관리자)

**기능 대응**

- 회원가입/로그인/회원정보 수정/탈퇴
- 배송지 정보 저장/관리
- 관리자 권한 (상품/주문/카테고리 관리)

### 필드 구조

```jsx
// users
{
  _id: ObjectId,
  email: String,          // unique, required
  passwordHash: String,   // bcrypt 결과
  name: String,           // 필수
  phone: String,          // 선택

  role: {                 // "user" | "admin"
    type: String,
    default: "user"
  },

  addresses: [            // 배송지 관리
    {
      _id: ObjectId,      // 서브문서 id
      recipientName: String,
      phone: String,
      zipCode: String,
      address1: String,   // 기본 주소
      address2: String,   // 상세 주소
      memo: String,       // 배송 메모
      isDefault: Boolean  // 기본 배송지 여부
    }
  ],

  isDeleted: {            // 회원탈퇴 처리 (soft delete 추천)
    type: Boolean,
    default: false
  },

  createdAt: Date,
  updatedAt: Date
}

```

**추천 인덱스**

- `email` : unique index
- `role` : 관리자 조회용 index

---

## 2. categories 컬렉션 (카테고리 관리)

**기능 대응**

- 카테고리 목록/관리 (추가/수정/삭제)
- 상품 카테고리별 조회

```jsx
// categories
{
  _id: ObjectId,
  name: String,             // 카테고리명
  parentCategoryId: ObjectId, // 상위 카테고리 (없으면 null)
  sortOrder: Number,        // 정렬 순서
  isActive: {               // 비활성 카테고리 숨김용
    type: Boolean,
    default: true
  },
  createdAt: Date,
  updatedAt: Date
}

```

**추천 인덱스**

- `parentCategoryId + sortOrder`

---

## 3. products 컬렉션 (상품 관리)

**기능 대응**

- 상품 목록/상세 조회
- 다중 이미지, 재고, 정렬(가격/최신/인기)
- 관리자 상품 등록/수정/삭제
- 재고 관리, 인기 상품(판매량 기준)

```jsx
// products
{
  _id: ObjectId,
  name: String,                      // 상품명
  description: String,               // 상세 설명 (HTML/Markdown 가능)
  categoryId: ObjectId,              // categories._id

  price: Number,                     // 현재 판매가
  originalPrice: Number,             // (선택) 정가

  images: [String],                  // 이미지 URL 배열 (S3 등)
  stock: Number,                     // 재고 수량

  status: {                          // "onSale" | "offSale" | "soldOut"
    type: String,
    default: "onSale"
  },

  // 인기 정렬용
  soldCount: {                       // 누적 판매 수량
    type: Number,
    default: 0
  },
  viewCount: {                       // 조회수 (선택)
    type: Number,
    default: 0
  },

  // 리뷰/평점 캐시 (리스트 화면 성능용, 상세에서 다시 계산해도 ok)
  averageRating: {                   // 평균 평점
    type: Number,
    default: 0
  },
  reviewCount: {                     // 리뷰 수
    type: Number,
    default: 0
  },

  createdAt: Date,
  updatedAt: Date
}

```

**추천 인덱스**

- `categoryId`
- `price`
- `soldCount` (인기순 정렬용)
- 텍스트 인덱스: `{ name: "text", description: "text" }` (키워드 검색용)

---

## 4. carts 컬렉션 (장바구니)

**기능 대응**

- 장바구니 추가/조회/수량 변경/삭제
- 총 금액 자동 계산(백엔드에서 계산)

MVP에선 **user당 장바구니 1개**로 설계하고, 내부에 items 배열로 관리하는 게 편함.

```jsx
// carts
{
  _id: ObjectId,
  userId: ObjectId,        // users._id

  items: [
    {
      _id: ObjectId,
      productId: ObjectId, // products._id
      quantity: Number,    // 수량
      // 스냅샷 정보(선택): 장바구니에 담을 당시의 가격
      priceAtAdded: Number
    }
  ],

  updatedAt: Date,
  createdAt: Date
}

```

> 실제 결제 시에는 products 컬렉션에서 최신 가격/재고를 다시 확인하고,
>
> 최종 가격은 orders에 스냅샷으로 저장하는 구조가 좋음.

**추천 인덱스**

- `userId` (로그인 사용자별 장바구니 조회)

---

## 5. orders 컬렉션 (주문/결제)

**기능 대응**

- 주문서 작성 / 결제 처리
- 주문번호 발급, 주문 내역/상세 조회
- 주문 상태 관리, 주문 취소
- 관리자 주문/배송 상태 변경
- 기본 매출 통계의 기반 데이터

```jsx
// orders
{
  _id: ObjectId,
  orderNumber: String,         // 사람이 읽기 좋은 주문번호 (예: "20251116-000123")
  userId: ObjectId,            // 주문자 (users._id)

  items: [
    {
      _id: ObjectId,
      productId: ObjectId,     // products._id
      productName: String,     // 주문 시점 상품명 스냅샷
      productImage: String,    // 대표 이미지 스냅샷
      price: Number,           // 주문 시점 단가
      quantity: Number,        // 수량
      totalPrice: Number       // price * quantity
    }
  ],

  // 금액 정보
  amounts: {
    productsTotal: Number,     // 상품 금액 합
    shippingFee: Number,       // 배송비
    discountTotal: Number,     // 할인 금액 (향후 쿠폰/포인트 추가 대비)
    paymentTotal: Number       // 최종 결제 금액
  },

  // 배송지 정보(스냅샷, user 주소 복사)
  shipping: {
    recipientName: String,
    phone: String,
    zipCode: String,
    address1: String,
    address2: String,
    memo: String
  },

  // 결제 정보
  payment: {
    method: String,            // "card", "vbank" 등 (MVP에선 간단히 "card")
    status: String,            // "pending" | "paid" | "failed" | "refunded"
    transactionId: String,     // PG사 거래번호(있다면)
    paidAt: Date               // 결제 완료 시각
  },

  // 주문 상태
  status: {                    // 전체 주문의 상태
    type: String,              // "pending" | "paid" | "preparing" | "shipping" | "completed" | "cancelled"
    default: "pending"
  },

  // 취소 관련
  cancel: {
    isCancelled: { type: Boolean, default: false },
    reason: String,
    cancelledAt: Date
  },

  createdAt: Date,             // 주문 생성(결제 시도 시작)
  updatedAt: Date
}

```

**추천 인덱스**

- `userId + createdAt` (마이페이지 주문 내역 조회)
- `orderNumber` (검색용)
- `status` / `createdAt` (관리자 화면 필터링용)

---

## 6. reviews 컬렉션 (리뷰)

**기능 대응**

- 구매 확정 상품 리뷰 작성/수정/삭제
- 별점, 텍스트, 이미지 첨부
- 상품별 리뷰 목록 조회, 평균 평점
- 내가 작성한 리뷰 조회

리뷰를 **독립 컬렉션**으로 두고

`productId`, `userId`, `orderId` 또는 `orderItemId`를 참조해

“구매한 사람만 리뷰 가능 + 1개만 작성”을 로직으로 체크.

```jsx
// reviews
{
  _id: ObjectId,
  productId: ObjectId,        // products._id
  userId: ObjectId,           // users._id
  orderId: ObjectId,          // orders._id (구매 이력 확인용)
  orderItemId: ObjectId,      // orders.items._id (옵션: 더 정확히 연결하고 싶다면)

  rating: Number,             // 1~5
  content: String,            // 리뷰 텍스트
  images: [String],           // 이미지 URL 배열 (최대 5장)

  isDeleted: {                // 삭제 시 soft delete
    type: Boolean,
    default: false
  },

  createdAt: Date,
  updatedAt: Date
}

```

**추천 인덱스**

- `productId + createdAt` (상품별 리뷰 최신순 조회)
- `userId` (내가 작성한 리뷰)
- `orderId` 또는 `orderItemId` (이미 리뷰 작성했는지 체크용)

> 평균 평점, 리뷰 수 업데이트 전략
>
> - 리뷰 작성/수정/삭제 시
>   `products` 컬렉션의 `averageRating`, `reviewCount`를 함께 업데이트
>   → 목록 화면에서 빠르게 표시 가능.

---

## 7. 매출 통계 (MVP 기준)

요구사항에는 **“매출 통계 조회 (기본)”**가 선택으로 들어있으니까

초기엔 별도 컬렉션 없이 **orders에서 Aggregation**으로 처리해도 충분해.

예:

- 일자별 매출: `status = "paid" or "completed"` 기준으로 `createdAt` 그룹
- 카테고리별 매출: `orders.items.productId` → `products.categoryId` 조인(lookup)

추후 성능 이슈 생기면

- `sales_summaries` 같은 컬렉션 만들어
  일 단위/월 단위로 미리 집계된 값만 저장하는 식으로 확장 가능.

---

## 8. (옵션) Mongoose 스키마로 쓸 때 예시

예를 들면 `User`는 이렇게 시작하면 됨:

```jsx
// models/User.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    recipientName: String,
    phone: String,
    zipCode: String,
    address1: String,
    address2: String,
    memo: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    phone: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: [addressSchema],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
```

나머지도 이 구조 그대로 `timestamps: true` 옵션 주고

필드만 맞춰서 정의하면 돼.

---

# 배포 환경 설정 가이드

## 배포 URL

- **프론트엔드**: https://shopping-mall-demo-fe.vercel.app/
- **백엔드**: https://port-0-shopping-mall-demo-be-milmit5ve61b6a6d.sel3.cloudtype.app/

---

## 배포 순서

배포는 다음 순서로 진행해야 합니다:

1. **데이터베이스 설정** (MongoDB Atlas)
2. **백엔드 배포** (Cloudtype)
3. **프론트엔드 배포** (Vercel)

---

## 1. 데이터베이스 설정 (MongoDB Atlas)

백엔드 배포 전에 데이터베이스를 먼저 설정해야 합니다.

### 1-1. MongoDB Atlas 클러스터 생성

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)에 접속하여 계정 생성
2. 무료 클러스터 생성 (M0 Free Tier 권장)
3. 클러스터 생성 완료 대기 (약 3-5분 소요)

### 1-2. Database Access 설정

1. MongoDB Atlas 대시보드 → **Database Access** 메뉴
2. **Add New Database User** 클릭
3. 사용자 이름과 비밀번호 설정
   - Authentication Method: Password
   - Username: 원하는 사용자 이름 입력 (예: `admin`)
   - Password: 강력한 비밀번호 설정 (최소 8자 이상, 대소문자, 숫자, 특수문자 포함 권장)
4. Database User Privileges: **Atlas admin** 권한 부여
5. **Add User** 클릭하여 사용자 생성

### 1-3. Network Access 설정

1. MongoDB Atlas 대시보드 → **Network Access** 메뉴
2. **Add IP Address** 클릭
3. 모든 IP에서 접근 허용: `0.0.0.0/0` 입력
   - 또는 Cloudtype의 특정 IP 주소만 허용 (보안 강화)
4. **Confirm** 클릭

### 1-4. Connection String 확인

1. MongoDB Atlas 대시보드 → **Database** 메뉴
2. **Connect** 버튼 클릭
3. **Connect your application** 선택
4. Driver: **Node.js**, Version: **5.5 or later** 선택
5. Connection String 복사
   - 형식: `mongodb+srv://<username>:<password>@<cluster-url>/<database-name>`
   - 예: `mongodb+srv://admin:your-password@cluster0.xxxxx.mongodb.net/shopping-mall-demo`
   - **주의**: `<username>`, `<password>`, `<cluster-url>`는 실제 값으로 대체해야 합니다
6. 데이터베이스 이름을 연결 문자열에 포함 (예: `/shopping-mall-demo`)

---

## 2. 백엔드 배포 (Cloudtype)

데이터베이스 설정이 완료된 후 백엔드를 배포합니다.

### 2-1. 프로젝트 연결

1. [Cloudtype](https://cloudtype.io) 대시보드 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. GitHub 저장소 연결 (또는 직접 코드 업로드)
4. 빌드 설정 확인

### 2-2. 환경 변수 설정

Cloudtype 대시보드에서 다음 환경 변수들을 설정합니다:

```bash
# 서버 포트
PORT=5000

# MongoDB Atlas 연결 문자열 (1단계에서 복사한 값)
# 형식: mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shopping-mall-demo

# JWT 인증
JWT_SECRET=your-secure-jwt-secret-key-here
ACCESS_TOKEN_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# 포트원(아임포트) 결제 게이트웨이
PORTONE_REST_API_KEY=your-portone-rest-api-key
PORTONE_REST_API_SECRET=your-portone-rest-api-secret

# Cloudinary (이미지 관리)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS Configuration (선택사항)
# 기본적으로 localhost:3000과 배포된 프론트엔드 URL이 자동으로 허용됩니다.
# 추가로 허용할 Origin이 필요한 경우에만 설정하세요.
# ALLOWED_ORIGINS=https://example.com,https://another-domain.com
```

**설정 방법:**

1. Cloudtype 대시보드 → 프로젝트 선택
2. **환경 변수** 또는 **Settings → Environment Variables** 메뉴
3. 위의 환경 변수들을 하나씩 추가
4. 각 변수의 Value 입력
5. 저장

**중요 사항:**

- `JWT_SECRET`: 강력한 랜덤 문자열 사용
  - 생성 방법: `openssl rand -base64 32` 명령어 실행
- `MONGODB_URI`: 1단계에서 복사한 연결 문자열 사용
- `PORTONE_REST_API_KEY`, `PORTONE_REST_API_SECRET`: 포트원 대시보드에서 발급받은 키 사용
- `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary 대시보드에서 발급받은 키 사용

### 2-3. 포트 설정

Cloudtype은 Docker 컨테이너 기반으로 앱을 실행합니다. 포트를 명시적으로 설정해야 합니다.

**방법 1: Settings에서 포트 지정 (권장)**

1. Cloudtype 대시보드 → 프로젝트 선택
2. **Settings** → **Port** 메뉴
3. 포트 번호 `5000` 입력
4. 저장

**방법 2: 환경 변수로 포트 지정**

- 환경 변수에 `PORT=5000` 추가 (이미 위에서 설정함)

### 2-4. 배포 실행

1. 환경 변수 설정 완료 후
2. **Deploy** 또는 **Redeploy** 버튼 클릭
3. 빌드 및 배포 진행 상황 확인
4. 배포 완료 후 백엔드 URL 확인

### 2-5. CORS 설정 확인

백엔드 서버는 다음 Origin에서의 요청을 자동으로 허용합니다:

- `http://localhost:3000` (로컬 개발 환경)
- `https://shopping-mall-demo-fe.vercel.app` (배포된 프론트엔드)

추가 Origin이 필요한 경우 `ALLOWED_ORIGINS` 환경 변수를 설정하세요.

### 2-6. 백엔드 확인

배포가 완료되면 다음 엔드포인트로 확인:

- Health check: `https://port-0-shopping-mall-demo-be-milmit5ve61b6a6d.sel3.cloudtype.app/health`
- API 확인: `https://port-0-shopping-mall-demo-be-milmit5ve61b6a6d.sel3.cloudtype.app/`

---

## 3. 프론트엔드 배포 (Vercel)

백엔드 배포가 완료된 후 프론트엔드를 배포합니다.

### 3-1. 프로젝트 연결

1. [Vercel](https://vercel.com) 대시보드 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. GitHub 저장소 연결 (또는 직접 코드 업로드)
4. Framework Preset: **Vite** 선택
5. 빌드 설정 확인

### 3-2. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수들을 설정합니다:

```
VITE_API_BASE_URL=https://port-0-shopping-mall-demo-be-milmit5ve61b6a6d.sel3.cloudtype.app
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset-name
```

**설명:**

- `VITE_API_BASE_URL`: 백엔드 API 서버 주소 (2단계에서 배포한 백엔드 URL)
- `VITE_CLOUDINARY_CLOUD_NAME`: Cloudinary 클라우드 이름 (이미지 업로드용)
- `VITE_CLOUDINARY_UPLOAD_PRESET`: Cloudinary 업로드 프리셋 (이미지 업로드용)

**설정 방법:**

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables** 메뉴
3. 각 환경 변수를 하나씩 추가:
   - Name: `VITE_API_BASE_URL`
   - Value: 백엔드 URL 입력
   - Environment: **Production**, **Preview**, **Development** 모두 선택
4. 나머지 환경 변수들도 동일하게 추가
5. 저장

### 3-3. 배포 실행

1. 환경 변수 설정 완료 후
2. **Deploy** 버튼 클릭 (또는 Git push 시 자동 배포)
3. 빌드 및 배포 진행 상황 확인
4. 배포 완료 후 프론트엔드 URL 확인

### 3-4. 프론트엔드 확인

배포가 완료되면 프론트엔드 URL로 접속하여 확인:

- 프론트엔드: `https://shopping-mall-demo-fe.vercel.app/`

---

## 4. CORS 설정 개선 (보안 강화)

현재 백엔드는 모든 도메인에서 접근을 허용하고 있습니다. 보안을 위해 프론트엔드 도메인만 허용하도록 수정하는 것을 권장합니다.

### 4-1. 백엔드 코드 수정

`server/src/index.js` 파일의 CORS 설정을 다음과 같이 변경:

```javascript
// 현재 (모든 도메인 허용)
app.use(cors());

// 개선 (특정 도메인만 허용)
app.use(
  cors({
    origin: [
      "https://shopping-mall-demo-fe.vercel.app",
      "http://localhost:3000", // 개발 환경용
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

### 4-2. 변경사항 배포

1. 코드 수정 후 Git에 커밋 및 푸시
2. Cloudtype에서 자동 재배포 또는 수동 재배포

---

## 5. 포트원(아임포트) 설정

### 5-1. 프론트엔드 포트원 가맹점 식별코드

- 현재 코드에서 `IMP.init("imp47103540")` 사용 중
- 프로덕션 환경에서는 실제 가맹점 식별코드로 변경 필요

### 5-2. 설정 위치

- `client/src/pages/order/OrderPage.jsx` 파일의 `IMP.init()` 부분
- 환경 변수로 관리하는 것을 권장

---

## 6. 확인 사항 체크리스트

### 데이터베이스 (MongoDB Atlas)

- [ ] MongoDB Atlas 클러스터 생성 완료
- [ ] Database Access 사용자 생성 완료
- [ ] Network Access 설정 완료 (0.0.0.0/0 또는 특정 IP)
- [ ] Connection String 확인 및 복사 완료

### 백엔드 (Cloudtype)

- [ ] 프로젝트 연결 완료
- [ ] `PORT=5000` 설정 완료 (또는 Cloudtype Settings에서 포트 지정)
- [ ] `MONGODB_URI` 환경 변수 설정 완료
- [ ] `JWT_SECRET` 환경 변수 설정 완료 (강력한 키 사용)
- [ ] `PORTONE_REST_API_KEY` 환경 변수 설정 완료
- [ ] `PORTONE_REST_API_SECRET` 환경 변수 설정 완료
- [ ] `CLOUDINARY_CLOUD_NAME` 환경 변수 설정 완료
- [ ] `CLOUDINARY_API_KEY` 환경 변수 설정 완료
- [ ] `CLOUDINARY_API_SECRET` 환경 변수 설정 완료
- [ ] 배포 완료
- [ ] Health check 엔드포인트 확인: `https://port-0-shopping-mall-demo-be-milmit5ve61b6a6d.sel3.cloudtype.app/health`

### 프론트엔드 (Vercel)

- [ ] 프로젝트 연결 완료
- [ ] `VITE_API_BASE_URL` 환경 변수 설정 완료
- [ ] `VITE_CLOUDINARY_CLOUD_NAME` 환경 변수 설정 완료
- [ ] `VITE_CLOUDINARY_UPLOAD_PRESET` 환경 변수 설정 완료
- [ ] 배포 완료
- [ ] 프론트엔드 접속 확인

### 통합 테스트

- [ ] 프론트엔드에서 백엔드 API 호출 테스트
- [ ] 로그인/회원가입 기능 테스트
- [ ] 상품 조회 기능 테스트
- [ ] 이미지 업로드 기능 테스트
- [ ] 주문/결제 기능 테스트

---

## 7. 문제 해결

### CORS 오류 발생 시

- 백엔드 서버 코드에서 배포된 프론트엔드 URL(`https://shopping-mall-demo-fe.vercel.app`)이 `allowedOrigins` 배열에 포함되어 있는지 확인
- 브라우저 콘솔에서 정확한 오류 메시지 확인
- 추가 Origin이 필요한 경우 `ALLOWED_ORIGINS` 환경 변수 설정
- 백엔드 서버 재배포 후 확인

### API 호출 실패 시

- 프론트엔드의 `VITE_API_BASE_URL` 환경 변수가 올바르게 설정되었는지 확인
- 백엔드 Health check 엔드포인트가 정상 작동하는지 확인
- 네트워크 탭에서 요청 URL 확인
- 백엔드 로그 확인 (Cloudtype 대시보드)

### MongoDB 연결 실패 시

- MongoDB Atlas의 Network Access에서 Cloudtype IP 주소 허용 확인
- `MONGODB_URI` 환경 변수가 올바른지 확인
- MongoDB Atlas 사용자 권한 확인
- MongoDB Atlas 클러스터 상태 확인

### 이미지 업로드 실패 시

- Cloudinary 환경 변수가 올바르게 설정되었는지 확인
- Cloudinary Upload Preset이 "Unsigned" 타입인지 확인
- Cloudinary 대시보드에서 API 키 권한 확인

---

## 8. 추가 권장 사항

### 8-1. 환경 변수 보안

- 민감한 정보는 절대 코드에 하드코딩하지 않기
- 환경 변수는 배포 플랫폼의 환경 변수 기능 사용
- Git 저장소에 `.env` 파일 커밋하지 않기

### 8-2. HTTPS 사용

- 프로덕션 환경에서는 반드시 HTTPS 사용
- Vercel과 Cloudtype은 기본적으로 HTTPS 제공

### 8-3. 에러 로깅

- 프로덕션 환경에서 발생하는 에러를 모니터링할 수 있는 도구 사용 권장
- 예: Sentry, LogRocket 등

### 8-4. 백업

- MongoDB Atlas의 자동 백업 기능 활성화 권장
- 정기적인 데이터 백업 계획 수립

### 8-5. 성능 모니터링

- Cloudtype과 Vercel의 모니터링 도구 활용
- API 응답 시간 및 에러율 모니터링

---

## 9. 배포 순서 요약

1. ✅ **MongoDB Atlas 설정** → 데이터베이스 준비
2. ✅ **백엔드 배포 (Cloudtype)** → API 서버 준비
3. ✅ **프론트엔드 배포 (Vercel)** → 웹 애플리케이션 준비
4. ✅ **CORS 설정 개선** → 보안 강화
5. ✅ **통합 테스트** → 전체 기능 확인

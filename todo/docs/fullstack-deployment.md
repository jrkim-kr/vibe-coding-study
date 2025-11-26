# 풀스택 배포 가이드

이 문서는 Todo 앱(백엔드 + 프론트엔드)을 프로덕션 환경에 배포하는 전체 과정을 정리한 가이드입니다.

## 전체 구성 개요

- **데이터베이스**: MongoDB Atlas
- **백엔드 서버**: Cloudtype (Node.js + Express)
- **프론트엔드 (React)**: Vercel (`todo-react`)
- **프론트엔드 (Vanilla JS, 선택)**: Vercel/Netlify 등 정적 호스팅 (`todo-firebase`)

---

## 1. MongoDB Atlas 설정

### 1-1. 클러스터 및 계정 생성

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)에서 계정 생성 및 클러스터 생성
2. Database Access에서 사용자 생성
3. Network Access에서 IP 주소 허용 (0.0.0.0/0로 모든 IP 허용 가능)
4. Connect → Drivers에서 Connection String 복사
5. Cloudtype 환경 변수에 `MONGODB_URI` 설정

---

## 2. 백엔드 배포 (Cloudtype)

### 2-1. 프로젝트 연결

[Cloudtype](https://cloudtype.io)에 프로젝트를 연결합니다.

### 2-2. 환경 변수 설정

Cloudtype 대시보드에서 다음 환경 변수를 설정합니다:

- `MONGODB_URI`: MongoDB Atlas 연결 문자열

### 2-3. 포트 설정 (중요)

Cloudtype은 Docker 컨테이너 기반으로 앱을 실행하며, 내부 포트를 자동으로 감지하지 못하면 도메인을 생성하지 않습니다. 서버 코드가 `PORT`를 사용해도 Cloudtype 설정에 포트가 명시되지 않으면 외부 도메인이 생성되지 않습니다.

다음 두 가지 방법 중 하나를 선택하여 포트를 설정해야 합니다:

#### 방법 1: Settings → Port 설정

- Cloudtype 대시보드에서 Settings → Port에 `5000` 지정
- Cloudtype에게 "이 앱은 5000번 포트를 열어요"라고 명시적으로 알려주는 방법

#### 방법 2: 환경 변수로 PORT 지정

- Cloudtype 대시보드 환경 변수에 `PORT=5000` 추가
- 서버 코드에서 `process.env.PORT`를 사용하므로 이 방법도 가능

### 2-4. 배포 실행

빌드 및 배포가 자동으로 실행됩니다.

---

## 3. 프론트엔드(Vercel) 배포 (React 버전)

Todo 프론트엔드는 `todo-react`(Vite + React)를 기준으로 Vercel에 배포할 수 있습니다.

### 3-1. Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에 GitHub 계정으로 로그인합니다.
2. "Add New Project"를 선택하고, 이 레포지토리를 선택합니다.
3. `todo-react` 디렉토리를 프론트엔드 루트로 사용하도록 설정합니다.
   - Root Directory: `todo/todo-react`

### 3-2. 빌드 설정

Vercel이 Vite 프로젝트를 자동으로 인식하지만, 필요하다면 다음을 확인합니다:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

### 3-3. 환경 변수 설정

Vercel 프로젝트의 Environment Variables에 다음을 추가합니다:

- `VITE_API_BASE_URL`: 배포된 백엔드(Cloudtype) 도메인
  - 예시: `https://your-backend.cloudtype.app`

로컬 개발 시에는 `.env`에 아래와 같이 설정합니다:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3-4. 배포

환경 변수 설정 후 "Deploy"를 클릭하면 Vercel이 빌드와 배포를 자동으로 진행합니다.

- main/master 브랜치에 푸시될 때마다 자동으로 재배포됩니다.

### 3-5. Vanilla JS 버전(todo-firebase) 배포 (선택)

`todo-firebase`는 정적 파일(HTML, CSS, JS)만으로 구성되어 있으므로, 다음과 같은 방법으로 배포할 수 있습니다:

- Vercel 또는 Netlify에서 정적 사이트로 배포
  - Root Directory: `todo/todo-firebase`
  - Build Command: (없음)
  - Output Directory: `/`

이 경우에도 백엔드 API 주소(`http://localhost:5000` 또는 Cloudtype URL)가 올바르게 설정되어 있어야 합니다.

---

## 4. 참고사항 & 체크리스트

- **Cloudtype**
  - Node.js 애플리케이션을 자동으로 감지하고 배포합니다.
  - 포트 설정이 제대로 되지 않으면 외부 도메인이 생성되지 않으므로 반드시 설정해야 합니다.
- **Vercel**
  - `VITE_API_BASE_URL`은 항상 **백엔드 실제 도메인**을 가리켜야 합니다.
  - 백엔드 도메인 변경 시, `VITE_API_BASE_URL` 환경 변수를 수정한 뒤 다시 배포해야 합니다.
- **최종 체크리스트**
  - [ ] Atlas IP 화이트리스트 및 사용자/비밀번호 설정 완료
  - [ ] Cloudtype 환경 변수 `MONGODB_URI`, `PORT` 설정
  - [ ] 백엔드 헬스체크(예: `/` 또는 `/todos`)로 정상 응답 확인
  - [ ] Vercel 환경 변수 `VITE_API_BASE_URL` 설정
  - [ ] 프론트엔드에서 할 일 CRUD가 정상 동작하는지 최종 확인

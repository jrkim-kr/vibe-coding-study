# Todo 프로젝트 모음

`todo/` 디렉토리는 바이브 코딩 강의에서 제작한 Todo 애플리케이션 실습 결과물과 학습 문서를 한곳에 정리한 공간입니다. 동일한 백엔드(`todo-backend`)를 기반으로 Vanilla JS 버전(`todo-firebase`)과 React 버전(`todo-react`) 두 가지 프론트엔드를 제공하며, 과거 Firebase 실습 자료와 강의 프롬프트는 `docs/`에서 보관합니다.

## 📁 디렉토리 구조

```
todo/
├── README.md
├── docs/
│   ├── backend-architecture.md
│   ├── backend-deployment.md
│   ├── todo-tech-stack.md
│   ├── mvc-pattern.md
│   ├── lessons/            # 강의 프롬프트 및 결과물
│   └── legacy/             # Firebase 시절 설정 파일 등 히스토리 자료
├── todo-backend/
│   ├── README.md
│   └── src/…
├── todo-firebase/          # Vanilla JS + REST API 버전
│   ├── README.md
│   └── (정적 자산)
└── todo-react/             # Vite + React 버전
    ├── README.md
    └── src/…
```

## 🚀 실행 가이드

1. **백엔드**  
   ```bash
   cd todo/todo-backend
   npm install
   npm run dev
   ```
   `.env`에 `MONGODB_URI`를 설정하세요. 자세한 내용은 `todo-backend/README.md` 참고.

2. **Vanilla JS 프론트 (`todo-firebase`)**  
   ```bash
   cd todo/todo-firebase
   python -m http.server 8000  # 또는 원하는 정적 서버
   ```
   초기 Firebase 버전에서 사용한 설정 파일은 `../docs/legacy/`에 보존했습니다.

3. **React 프론트 (`todo-react`)**  
   ```bash
   cd todo/todo-react
   npm install
   npm run dev
   ```
   `.env`에 `VITE_API_BASE_URL=http://localhost:5000`를 설정하면 백엔드와 연동됩니다.

## 🗂 문서 & 히스토리

- `docs/backend-architecture.md` : MVC 흐름 및 모델 설명
- `docs/backend-deployment.md` : MongoDB Atlas & Cloudtype 배포 가이드
- `docs/todo-tech-stack.md` : Todo 전체 기술 스택 정리
- `docs/mvc-pattern.md` : MVC 패턴 개념 및 예시
- `docs/lessons/` : 강의별 프롬프트 및 결과물 (`4-2_prompt.md`, `7_prompt.md` 등)
- `docs/legacy/` : Firebase Realtime Database 버전에서 사용한 설정 파일
- 각 프로젝트별 상세 문서는 해당 폴더의 `README.md`에서 확인할 수 있습니다.

## ✅ 체크리스트

- 백엔드/프론트 실행 전 `.env`를 올바르게 설정했는지 확인
- `todo-backend`가 실행 중인지 확인한 뒤 프론트엔드를 띄우기
- 문서 수정 시 `todo/docs/` 하위 폴더 규칙을 따라 정리


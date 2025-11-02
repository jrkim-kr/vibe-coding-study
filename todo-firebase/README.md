# Firebase 할일 관리 앱

미니멀리즘 디자인의 할일 관리 웹 애플리케이션입니다. Firebase Realtime Database를 사용하여 실시간 데이터 동기화를 제공합니다.

## 🚀 시작하기

### 1. Firebase 설정

1. `firebase-config.example.js` 파일을 `firebase-config.js`로 복사합니다:

   ```bash
   cp firebase-config.example.js firebase-config.js
   ```

2. `firebase-config.js` 파일을 열고 실제 Firebase 프로젝트 정보를 입력합니다:
   - Firebase 콘솔(https://console.firebase.google.com)에서 프로젝트 설정 > 일반 탭으로 이동
   - 웹 앱에 Firebase 추가에서 설정 정보 복사

### 2. 로컬 실행

프로젝트는 정적 파일이므로 웹 서버가 필요합니다. 다음 중 하나를 사용하세요:

**Python 사용:**

```bash
python -m http.server 8000
```

**Node.js http-server 사용:**

```bash
npx http-server
```

**VS Code Live Server 확장 사용:**

- VS Code에서 `index.html` 파일을 우클릭
- "Open with Live Server" 선택

그 후 브라우저에서 `http://localhost:8000` (또는 지정한 포트)로 접속합니다.

## 📁 프로젝트 구조

```
todo-firebase/
├── index.html              # HTML 구조
├── style.css              # 미니멀리즘 스타일
├── script.js              # 할일 관리 로직 및 Firebase 연동
├── firebase-config.js      # Firebase 설정 (Git에 포함되지 않음)
├── firebase-config.example.js  # Firebase 설정 예제
├── .gitignore            # Git 제외 파일 목록
└── README.md             # 프로젝트 설명서
```

## 🔒 보안

- `firebase-config.js` 파일은 `.gitignore`에 포함되어 있어 GitHub에 업로드되지 않습니다.
- Firebase 설정 정보는 절대 공개 저장소에 커밋하지 마세요.
- Firebase 보안 규칙을 설정하여 데이터베이스 접근을 제한하는 것을 권장합니다.

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **Backend**: Firebase Realtime Database
- **디자인**: 미니멀리즘 스타일

## ✨ 주요 기능

- ✅ 할일 추가
- ✏️ 할일 수정
- 🗑️ 할일 삭제
- ✓ 완료/미완료 토글
- 🔄 실시간 동기화 (Firebase)
- 💾 클라우드 저장소

## 📝 Firebase 보안 규칙 설정

Firebase Console > Realtime Database > 규칙 탭에서 다음 규칙을 설정하세요:

```json
{
  "rules": {
    "todos": {
      ".read": true,
      ".write": true
    }
  }
}
```

> ⚠️ 주의: 위 규칙은 모든 사용자가 읽기/쓰기 가능합니다. 프로덕션 환경에서는 인증을 추가하고 적절한 권한 규칙을 설정하세요.

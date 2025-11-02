# Firebase 할일 관리 앱 개발 로그

## 프로젝트 개요

HTML, CSS, JavaScript로 구현한 할일 관리 앱입니다. Firebase Realtime Database를 사용하여 클라우드 기반 CRUD 기능을 제공하며, 미니멀리즘 디자인을 적용했습니다.

## 개발 단계별 요약

### 1단계: 기본 할일 앱 구현

**요청**: HTML, CSS, JavaScript로 추가, 수정, 삭제 기능이 있는 할일앱을 토스 같은 디자인으로 만들어달라.

**구현 내용**:

- **파일 구조**:

  - `index.html`: 기본 HTML 구조
  - `style.css`: 토스 스타일 디자인 (파란색 그라데이션, 둥근 모서리, 부드러운 그림자)
  - `script.js`: 할일 관리 로직 (로컬 스토리지 사용)

- **주요 기능**:

  - 할일 추가: 입력 필드에서 Enter 키 또는 추가 버튼 클릭
  - 할일 수정: 수정 버튼 클릭 후 텍스트 변경 및 저장
  - 할일 삭제: 삭제 버튼 클릭
  - 완료 처리: 체크박스 클릭으로 완료/미완료 토글
  - 로컬 스토리지: 브라우저를 닫아도 데이터 유지

- **디자인 특징**:
  - 파란색 그라데이션 헤더 (#3182F6)
  - 둥근 모서리 (border-radius: 12px, 24px)
  - 부드러운 그림자 효과
  - 애니메이션 효과 (fadeIn, slideUp)

---

### 2단계: Firebase 초기화 코드 추가

**요청**: Firebase 초기화 코드를 JavaScript 파일에 추가해달라.

**구현 내용**:

- Firebase App SDK import 추가
- Firebase 설정 정보 추가 (apiKey, authDomain, projectId 등)
- `databaseURL` 추가 (Realtime Database)
- HTML에서 `type="module"`로 스크립트 로드 변경
- 모듈 스코프에서 전역 함수들을 `window` 객체에 할당하여 HTML 인라인 이벤트 핸들러 접근 가능하도록 설정

---

### 3단계: Firebase Realtime Database CRUD 구현

**요청**: CRUD 기능을 Firebase를 통해 구현해달라.

**구현 내용**:

- **Firebase Realtime Database SDK 추가**:

  ```javascript
  import {
    getDatabase,
    ref,
    push,
    remove,
    update,
    onValue,
  } from "firebase-database.js";
  ```

- **Create (생성)**:

  - `addTodo()`: `push()` 함수로 새 할일 추가
  - Firebase가 자동으로 고유 키 생성

- **Read (읽기)**:

  - `loadTodos()`: `onValue()` 함수로 실시간 데이터 동기화
  - Firebase 데이터가 변경될 때마다 자동으로 UI 업데이트
  - 여러 기기에서 동시 접속 시 자동 동기화

- **Update (수정)**:

  - `toggleTodo()`: `update()` 함수로 완료 상태 변경
  - `saveEdit()`: `update()` 함수로 할일 텍스트 수정

- **Delete (삭제)**:

  - `deleteTodo()`: `remove()` 함수로 할일 삭제

- **개선 사항**:
  - 모든 Firebase 작업에 try-catch 에러 처리 추가
  - 사용자에게 에러 발생 시 알림 표시
  - 생성 시간 기준 최신순 정렬

---

### 4단계: 수정/삭제 기능 오류 수정

**문제**: 수정과 삭제 기능이 작동하지 않음

**원인**: Firebase에서 생성된 문자열 키가 HTML 인라인 이벤트 핸들러에서 제대로 전달되지 않음

**해결 방법**:

- 모든 이벤트 핸들러에서 ID를 문자열로 감싸서 전달: `'${todo.id}'`
- `handleSaveEdit()` 함수 추가: 저장 버튼 클릭 시 입력 필드 값을 안전하게 가져오기
- 모든 버튼과 체크박스에 문자열 ID 전달 적용

**수정된 코드 예시**:

```javascript
// 수정 전
onclick = "deleteTodo(${todo.id})";

// 수정 후
onclick = "deleteTodo('${todo.id}')";
```

---

### 5단계: 수정 저장 시 UI 업데이트 문제 해결

**문제**: 수정 시 Firebase에는 저장되지만 웹사이트에서 저장 클릭 시 반응 없음

**원인**: `saveEdit()` 함수에서 Firebase 업데이트 후 UI를 다시 렌더링하지 않음

**해결 방법**:

- `saveEdit()` 함수에서 Firebase 업데이트 후 `renderTodos()` 호출 추가
- `loadTodos()` 함수에서 수정 중인 항목이 더 이상 존재하지 않으면 `editingId` 자동 초기화
- 즉시 UI 업데이트를 통해 사용자 경험 개선

**수정된 코드**:

```javascript
async function saveEdit(id, newText) {
  // ... Firebase 업데이트 ...
  editingId = null;
  renderTodos(); // 즉시 UI 업데이트
}
```

---

### 6단계: 미니멀리즘 디자인 적용

**요청**: 미니멀리즘 디자인으로 변경해달라.

**변경 사항**:

1. **색상 단순화**:

   - 그라데이션 제거 → 단색 배경 (#fafafa, #ffffff)
   - 주요 색상을 흑백으로 통일 (#1a1a1a, #e0e0e0)
   - 강조 색상 최소화

2. **장식 요소 제거**:

   - 모든 그림자 효과 제거 (`box-shadow` 제거)
   - 둥근 모서리 제거 (`border-radius` 제거)
   - 불필요한 애니메이션 제거

3. **레이아웃 단순화**:

   - 여백 증가 (padding: 40px, 60px)
   - 얇은 보더만 사용 (1px)
   - 수평 구분선으로 구조 명확화

4. **타이포그래피**:

   - 폰트 굵기 감소 (700 → 400)
   - 간격 조정으로 가독성 향상
   - 최소한의 서체 스타일

5. **버튼 및 인터랙션**:
   - 단순한 호버 효과 (opacity만 변경)
   - 최소한의 색상 변화
   - 얇은 보더 스타일
   - 직선형 디자인

**최종 디자인 특징**:

- 흑백 중심의 단순한 색상 팔레트
- 직선형 레이아웃
- 넓은 여백
- 최소한의 장식
- 깔끔하고 현대적인 느낌

---

## 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **Backend**: Firebase Realtime Database
- **디자인**: 미니멀리즘 스타일

## 주요 파일

- `index.html`: 앱의 HTML 구조
- `style.css`: 미니멀리즘 스타일 시트
- `script.js`: 할일 관리 로직 및 Firebase 연동

## 핵심 학습 내용

1. **Firebase Realtime Database 사용법**:

   - 실시간 데이터 동기화 (`onValue`)
   - 데이터 생성 (`push`), 수정 (`update`), 삭제 (`remove`)

2. **ES6 모듈 시스템**:

   - 모듈 스코프와 전역 스코프 처리
   - HTML 인라인 이벤트 핸들러와의 연동

3. **미니멀리즘 디자인 원칙**:

   - 불필요한 장식 제거
   - 여백 활용
   - 단순한 색상 팔레트
   - 직선형 레이아웃

4. **문제 해결 과정**:
   - 문자열과 숫자 타입 처리
   - 비동기 함수와 UI 업데이트 타이밍
   - 사용자 경험 개선

## 향후 개선 가능 사항

- 사용자 인증 추가 (Firebase Authentication)
- 할일 카테고리 분류
- 할일 검색 기능
- 할일 필터링 (완료/미완료)
- 반응형 디자인 최적화
- 다크 모드 지원

# 배포 가이드

이 문서는 Todo Backend를 배포하는 방법을 설명합니다.

## 배포 환경

이 프로젝트는 다음 플랫폼에 배포되어 있습니다:

- **데이터베이스**: MongoDB Atlas
- **백엔드 서버**: Cloudtype

## MongoDB Atlas 설정

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)에서 계정 생성 및 클러스터 생성
2. Database Access에서 사용자 생성
3. Network Access에서 IP 주소 허용 (0.0.0.0/0로 모든 IP 허용 가능)
4. Connect → Drivers에서 Connection String 복사
5. Cloudtype 환경 변수에 `MONGODB_URI` 설정

## Cloudtype 배포

### 1. 프로젝트 연결

[Cloudtype](https://cloudtype.io)에 프로젝트를 연결합니다.

### 2. 환경 변수 설정

Cloudtype 대시보드에서 다음 환경 변수를 설정합니다:

- `MONGODB_URI`: MongoDB Atlas 연결 문자열

### 3. 포트 설정 (중요)

Cloudtype은 Docker 컨테이너 기반으로 앱을 실행하며, 내부 포트를 자동으로 감지하지 못하면 도메인을 생성하지 않습니다. 서버 코드가 `PORT`를 사용해도 Cloudtype 설정에 포트가 명시되지 않으면 외부 도메인이 생성되지 않습니다.

다음 두 가지 방법 중 하나를 선택하여 포트를 설정해야 합니다:

#### 방법 1: Settings → Port 설정

- Cloudtype 대시보드에서 Settings → Port에 `5000` 지정
- Cloudtype에게 "이 앱은 5000번 포트를 열어요"라고 명시적으로 알려주는 방법

#### 방법 2: 환경 변수로 PORT 지정

- Cloudtype 대시보드 환경 변수에 `PORT=5000` 추가
- 서버 코드에서 `process.env.PORT`를 사용하므로 이 방법도 가능

### 4. 배포 실행

빌드 및 배포가 자동으로 실행됩니다.

## 참고사항

- Cloudtype은 Node.js 애플리케이션을 자동으로 감지하고 배포합니다.
- 포트 설정이 제대로 되지 않으면 외부 도메인이 생성되지 않으므로 반드시 설정해야 합니다.

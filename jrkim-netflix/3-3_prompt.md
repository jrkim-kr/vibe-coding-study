### 프롬프트

1. 영화 카드의 overview, vote_count, release_date 도 추가하고 싶어
2. overview (줄거리) 부분은 카드 클릭하면 모달창으로 보여줄 수 있어?

### 핵심 정리

에러 났을 경우의 확인 사항들

- Networks → Headers
  - Request URL
    - 1차 확인 : API 주소 일치 여부 (즉 내가 요청한 주소가 맞는지)
    - 2차 확인 : 쿼리 파라미터 확인 : 해당 서비스가 제공하고 있는 쿼리 파라미터가 맞는지
  - Status Code
- Networks → Payload
  - 정리된 쿼리 파라미터 값들
- Networks → Preview
  - Response의 읽기 쉬운 버전
- Networks → Response
  - 응답의 Raw 버전

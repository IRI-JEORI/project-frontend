# 백엔드 연동 가이드

## 1. 서버 주소 설정

[`src/config/api.ts`](../src/config/api.ts)에서 주소를 관리합니다.

- Android 에뮬레이터 개발 기본값: `http://10.0.2.2:8080`
- iOS 시뮬레이터 개발 기본값: `http://localhost:8080`
- 실제 Android 기기: `http://PC의_LAN_IP:8080` 또는 개발용 HTTPS 주소
- 배포: `PRODUCTION_API_BASE_URL`을 실제 HTTPS 주소로 변경

`10.0.2.2`는 Android 에뮬레이터에서 개발 PC의 `localhost`를 가리키는 특수 주소입니다.

## 2. API 호출 예시

```ts
import { ApiError, nunnunApi } from '../api';

try {
  const { accounts } = await nunnunApi.auth.getDemoAccounts();
  await nunnunApi.auth.demoLogin(accounts[0].id);

  const { groups } = await nunnunApi.group.list();
  const detail = await nunnunApi.group.detail(groups[0].id);
  console.log(detail.members);
} catch (error) {
  if (error instanceof ApiError) {
    console.warn(error.status, error.code, error.message);
  }
}
```

로그인 성공 시 Access Token과 Refresh Token은 AsyncStorage에 저장됩니다. 이후 API 호출에는 Access Token이 자동으로 붙고, `401` 응답 시 `/auth/reissue`를 호출한 뒤 원래 요청을 한 번 재시도합니다.

## 3. 인증사진 업로드

```ts
const selfVerify = await nunnunApi.wake.startSelfVerify();

const result = await nunnunApi.wake.uploadProof(
  selfVerify.wake_request_id,
  capturedPhotoPath,
);

if (result.pose_match_result === 'SUCCESS') {
  // 성공 화면
} else if (result.can_retry) {
  // 1회 재촬영
} else {
  // NEEDS_HELP
}
```

사진은 명세대로 `image` 필드의 `multipart/form-data`로 전송됩니다. `Content-Type`의 boundary는 React Native가 자동 생성하므로 직접 지정하지 않습니다.

## 4. 주요 API 객체

- `nunnunApi.auth`: 데모 계정, 로그인, 재발급, 로그아웃
- `nunnunApi.user`: 내 정보 조회·수정·탈퇴
- `nunnunApi.device`: FCM 토큰 등록
- `nunnunApi.wakeTarget`: 요일별 기상 목표
- `nunnunApi.dnd`: 방해금지 시간
- `nunnunApi.schedule`: 시간표 분석·등록·수정·삭제
- `nunnunApi.group`: 그룹 생성·참여·상세·초대 코드
- `nunnunApi.wake`: 깨우기, 요청 조회, 사진 판정, 셀프 인증
- `nunnunApi.me`: 오늘 정보, 취침, 통계, 수면 피드백

## 5. 화면 연동 순서

1. 앱 시작 또는 사용자 선택 시 `demoLogin`
2. 홈 화면에서 `group.list`
3. 그룹 화면에서 `group.detail`
4. 깨우기 버튼에서 `wake.wakeMember`
5. 알림 진입 시 `wake.getRequest`
6. 셀프 인증 시작 시 `wake.startSelfVerify`
7. 사진 업로드 시 `wake.uploadProof`
8. 성공·실패 응답에 따라 화면 전환

현재 화면은 데모 시연을 위해 AsyncStorage 상태를 사용하고 있습니다. 서버가 실행되면 위 순서대로 각 화면의 데모 읽기·쓰기를 API 호출로 교체하면 됩니다.

## 6. 백엔드와 확인이 필요한 명세 항목

현재 받은 문서에는 다음 항목의 정확한 응답 JSON이 빠져 있습니다.

- `POST /auth/reissue`
- `POST /auth/logout`
- `GET /users/me`, `PATCH /users/me`
- `GET /groups`
- 시간표 API 전체
- `GET /me/today`, `GET /me/stats`

현재 코드는 일반적인 형태로 작성되어 있습니다. 백엔드 실제 Swagger/OpenAPI 응답이 나오면 타입을 최종 확정해야 합니다.

또한 현재 프론트 데모와 API 개발 범위에 차이가 있습니다.

- API 명세의 그룹 정원은 4명이며 8명 확장은 제외
- 그룹 탈퇴, AI 친구, 리워드, 여러 그룹, 그룹 간 공유는 백엔드 범위에서 제외
- 프론트에 있는 위 기능들은 API가 추가되기 전까지 데모 전용으로만 동작

프론트는 DB에 직접 접속하지 않습니다. `React Native → API → DB` 구조이며, DB 문서는 응답 데이터와 관계를 이해하는 참고 자료로 사용합니다.

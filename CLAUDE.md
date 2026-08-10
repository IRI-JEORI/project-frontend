# 프로젝트 규칙 (React Native)

## 스타일
- 스타일은 인라인 style prop 대신 `StyleSheet.create`로 작성
- 색상/폰트 크기/spacing 값은 하드코딩 금지, `src/theme/tokens.ts`의 값을 참조
- 단위는 px가 아니라 숫자 그대로 (RN 기본 단위)

## 컴포넌트
- 새 컴포넌트 만들기 전 `src/components/`에 재사용 가능한 게 있는지 먼저 확인하고 알려줄 것
- 컴포넌트는 함수형 + TypeScript, props 타입은 named interface로 분리
- 폴더 구조: `src/screens/{ScreenName}/index.tsx`, 하위 컴포넌트는 같은 폴더의 `components/`

## 아이콘/이미지
- 아이콘은 react-native-svg 기반, `src/assets/icons/`에 있는 것 우선 사용
- 이미지 asset은 실제 파일 없으면 회색 placeholder View로 대체하고 TODO 주석 남기기

## 상태/네비게이션
- 네비게이션은 React Navigation (Stack/Tab, 프로젝트 기존 구조 따름)
- 로컬 상태는 useState, 전역 상태 필요하면 기존 스토어 패턴 따름

## 작업 방식
- Figma 디자인을 그대로 베끼되, 위 규칙과 충돌하면 규칙을 우선하고 왜 다르게 했는지 짧게 설명
- 화면 하나를 통째로 만들기 전에 컴포넌트 분해 계획을 먼저 제시하고 승인받을 것

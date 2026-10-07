## 개요

시추주상도(지질 주상도) 파일을 넣으면 **지층 구성을 3D로 시각화**하고, 상부 구조물의 하중을 입력하면 **필요지내력과 허용지내력을 비교해 기초 형식을 추천**하는 웹 앱을 Google Antigravity로 만들었습니다.

<figure><img src="assets/ai/geofoundation/app.webp" alt="지반 3D 시각화와 기초 추천 앱 화면"><figcaption>완성된 앱 — 왼쪽 지층 정보, 가운데 3D 지반 모델, 오른쪽 하중 입력과 안전율 분석</figcaption></figure>

- **앱 바로가기:** [ephemeral-florentine-e5b2ec.netlify.app](https://ephemeral-florentine-e5b2ec.netlify.app/) (시추주상도를 JSON 파일로 입력)
- 이전 버전: [vocal-liger-7bf65d.netlify.app](https://vocal-liger-7bf65d.netlify.app/)

## 구현한 기능

1. **지반 3D 모델링:** 심도별 토층(매립층 · 실트질 모래 · 풍화토 · 풍화암 · 연암)과 표준관입시험 N치를 3D 블록으로 표시
2. **환경 변수 반영:** 지하수위, 동결심도(남부/북부 지방), 건기/우기에 따른 지하수위 변동
3. **기초 추천:** 상부 하중 ÷ 면적으로 구한 필요지내력과 지반의 허용지내력(Terzaghi · Meyerhof 지지력 공식)을 비교해 얕은 기초 / 깊은 기초(말뚝 · 피어) 추천
4. **What-if 시뮬레이션:** 기초 종류 · 폭 · 깊이를 슬라이더로 바꾸면 안전율을 실시간 재계산 (안전: 초록 / 불안정: 빨강)

## 작업 방식

- **프롬프트를 위한 프롬프트:** 만들고 싶은 기능을 말로 길게 설명한 뒤, AI에게 "Antigravity에 넣을 프롬프트"를 먼저 작성하게 했습니다. 역할(지반 · 구조공학을 아는 풀스택 개발자), 목표, 기능별 요구사항, 출력 형식을 나눠 정리했습니다.
- Antigravity가 먼저 **구현 계획**을 제시하고, 검토 후 승인하면 실제 코드를 만드는 방식으로 진행했습니다.
- 완성된 `dist` 폴더를 Netlify Drop에 끌어다 놓아 바로 링크로 배포했습니다.

<figure><img src="assets/ai/geofoundation/app-2.webp" alt="앱의 다른 화면"><figcaption>기초 형식과 제원을 바꿔가며 안전율을 비교하는 화면</figcaption></figure>

## 시행착오 · 배운 점

- 시추주상도를 **이미지로 바로 읽게 하려면 AI API 키 연결이 필요**해서, 컴퓨터가 읽기 쉬운 **JSON 형식**으로 입력받도록 바꿨습니다.

## 느낀 점

<div class="pending">작성 예정 — 전공 지식(지지력 공식, 기초 형식)을 AI에게 정확히 전달하는 과정에서 느낀 점</div>

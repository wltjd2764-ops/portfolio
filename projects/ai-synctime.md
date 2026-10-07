## 개요

약속을 잡을 때 서로 가능한 시간을 맞추기 어렵다는 문제에서 출발해, **각자 가능한 날짜와 시간을 입력하면 모두가 가능한 시간을 자동으로 찾아주는 앱**을 만들었습니다.

- **앱 바로가기:** [SyncTime](https://taupe-biscochitos-709008.netlify.app/)

<div class="gallery">
<figure><img src="assets/ai/synctime/main.webp" alt="SyncTime 메인 화면"><figcaption>캘린더에서 모두 가능한 날짜가 초록색으로 표시</figcaption></figure>
<figure><img src="assets/ai/synctime/time-select.webp" alt="SyncTime 시간 선택 화면"><figcaption>날짜를 누르면 30분 단위로 시간 선택</figcaption></figure>
</div>

## 작업 방식 — 프롬프트 설계

원하는 기능을 먼저 말로 설명하고, AI에게 **개발용 프롬프트를 설계**하게 한 뒤 그 프롬프트로 앱을 만들었습니다.

1. **UI 흐름:** 캘린더에서 날짜 선택 → 해당 날짜의 가능한 시간 입력 (30분 블록, 토글 · 드래그)
2. **핵심 로직:** 참여자 전원이 겹치는 시간 계산, 없으면 가장 많은 인원이 가능한 시간을 1–3순위로 추천
3. **데이터 구조:** 사용자 · 날짜 · 시간대를 JSON 스키마로 설계

배운 점: UI 조작 방식("30분 단위 블록", "토글이나 드래그")을 구체적으로 적고, "모두 가능한 시간이 없을 때" 같은 예외 상황을 미리 넣어두면 결과물의 완성도가 크게 올라갔습니다.

## 시행착오

- 여러 사람이 함께 쓰도록 **Firebase DB를 연결**하는 과정에서 연결 오류가 발생해 여러 버전을 거쳤습니다.
- Google AI Studio로 다른 버전도 만들어 비교했습니다.

## 공룡검색기

같은 방식으로, 앞서 조사한 공룡 복원 주제를 이어 **공룡검색기** 앱도 만들었습니다. → [바로가기](https://chipper-gaufre-e6aae1.netlify.app/)

## 느낀 점

<div class="pending">작성 예정</div>

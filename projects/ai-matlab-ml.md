## 개요

Kaggle의 [Dinosaur Dataset](https://www.kaggle.com/datasets/smruthiiii/dinosaur-dataset)으로 공룡의 **식성(육식 · 초식 · 잡식)을 예측하는 분류 모델**을 MATLAB Classification Learner로 만들었습니다. 정확도를 높이는 것보다, **모델이 "커닝"하지 못하게 만드는 과정**이 핵심이었습니다.

- 전처리: 엑셀에서 불필요한 열 삭제, 결측치 제거
- 검증: 5겹 교차검증

## 시행착오 — 정확도가 높을수록 의심하기

| 단계 | 예측 변수 | 검증 정확도 | 문제 |
| --- | --- | --- | --- |
| 1차 | name, type, 몸길이, 시기, class, region | 98.5% | **name**: 공룡 이름과 식성을 1:1로 암기 (과적합) |
| 2차 | name 제거 | 98.3% | **type**: 수각류 = 육식, 용각류 · 각룡류 = 초식으로 거의 100% 일치 |
| 3차 | type 제거 | 96.0% | **class**: 조반목은 100% 초식이라 절반을 거저 맞힘 |
| 최종 | **몸길이, 첫 출현 시기, 마지막 출현 시기** | **88.1%** | 지역 정보도 과적합 위험이 있어 제외 |

<figure><img src="assets/ai/matlab-ml/importance-trial1.webp" alt="1차 모델의 변수 중요도"><figcaption>1차 모델 — 공룡 이름(name) 하나에 예측이 쏠린 모습</figcaption></figure>

<figure><img src="assets/ai/matlab-ml/importance-final.webp" alt="최종 모델의 변수 중요도"><figcaption>최종 모델 — 몸길이와 생존 시기만으로 예측</figcaption></figure>

최종적으로 **"뼈 모양이나 분류 정보 없이, 크기와 살았던 시대만으로 식성을 맞출 수 있는가"**를 검증하는 모델이 되었습니다. 앙상블(배깅 트리) 모델이 88.1%로 가장 높았고, 새로운 가상의 공룡 데이터(몸길이 2.5m, 8천만~7천만 년 전)를 넣어 예측까지 확인했습니다.

## 배운 점

- 정확도 98%는 좋은 결과가 아니라 **정답이 새고 있다는 신호**일 수 있다.
- 변수 중요도 그래프로 모델이 무엇을 보고 판단하는지 확인해야 한다.

## 느낀 점

<div class="pending">작성 예정</div>

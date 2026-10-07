"""Google 뉴스 RSS에서 건축·건설 관련 기사를 모아 data/news.json으로 저장한다.

GitHub Actions가 매일 실행한다. 표준 라이브러리만 사용한다.
카테고리나 검색어를 바꾸려면 CATEGORIES만 수정하면 된다.
"""
import json
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

CATEGORIES = {
    "건설경기": ["건설경기", "건설투자 전망", "건설수주 통계"],
    "수주": ["건설사 수주", "현대건설 OR 삼성물산 OR 대우건설 OR GS건설 OR DL이앤씨 수주"],
    "금리·PF·정책": ["부동산 PF 건설", "건설업 금리", "국토교통부 건설 정책"],
    "건축·설계": ["건축 설계공모", "건축상 수상", "건축설계사무소"],
    "원전·특수건축": ["원전 건설", "원전 수주", "SMR 건설", "원자력발전소 시공", "특수건축물"],
}
# 제목에 이 단어 중 하나라도 있어야 남긴다 (관련 없는 기사 걸러내기)
RELEVANT = ["건설", "건축", "수주", "시공", "착공", "준공", "분양", "주택", "아파트", "부동산",
            "PF", "원전", "원자력", "SMR", "재건축", "재개발", "정비사업", "국토부", "국토교통", "설계", "공사", "인프라", "SOC", "하도급"]
DAYS = 3           # 최근 며칠 기사까지
PER_CATEGORY = 12   # 카테고리별 최대 기사 수
OUT = Path(__file__).resolve().parent.parent / "data" / "news.json"


def fetch(query: str) -> list[dict]:
    q = urllib.parse.quote(f"{query} when:{DAYS}d")
    url = f"https://news.google.com/rss/search?q={q}&hl=ko&gl=KR&ceid=KR:ko"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        root = ET.fromstring(r.read())

    items = []
    for it in root.iter("item"):
        title = it.findtext("title", "").strip()
        source = it.findtext("source", "").strip()
        # 제목 끝의 " - 언론사"를 떼어낸다
        if source and title.endswith(f" - {source}"):
            title = title[: -len(source) - 3]
        try:
            published = parsedate_to_datetime(it.findtext("pubDate", ""))
        except (TypeError, ValueError):
            continue
        items.append({
            "title": title,
            "link": it.findtext("link", ""),
            "source": source,
            "published": published.astimezone(timezone.utc).isoformat(),
        })
    return items


def main() -> None:
    cutoff = datetime.now(timezone.utc) - timedelta(days=DAYS)
    seen = set()
    result = []

    for category, queries in CATEGORIES.items():
        pool = []
        for q in queries:
            try:
                pool.extend(fetch(q))
            except Exception as e:  # 한 검색어가 실패해도 나머지는 진행
                print(f"[warn] {q}: {e}")
        pool.sort(key=lambda x: x["published"], reverse=True)

        count = 0
        for item in pool:
            key = item["title"].replace(" ", "")[:40]
            if key in seen or datetime.fromisoformat(item["published"]) < cutoff:
                continue
            if not any(w in item["title"] for w in RELEVANT):
                continue
            seen.add(key)
            result.append({**item, "category": category})
            count += 1
            if count >= PER_CATEGORY:
                break

    if not result and OUT.exists():
        print("[warn] 수집된 기사가 없어 기존 파일을 유지합니다.")
        return

    result.sort(key=lambda x: x["published"], reverse=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        "updated": datetime.now(timezone.utc).isoformat(),
        "categories": list(CATEGORIES),
        "items": result,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(result)}건 저장 → {OUT}")


if __name__ == "__main__":
    main()

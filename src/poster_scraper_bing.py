# src/poster_scraper_bing.py
import requests
import json
import time
import random
from pathlib import Path
from bs4 import BeautifulSoup

BASE_DIR = Path(__file__).resolve().parent
INPUT_PATH = BASE_DIR / "mock.json"           # src/mock.json 위치
OUTPUT_PATH = BASE_DIR / "mock_updated.json"  # 결과 저장

HEADERS_LIST = [
    # 다양한 User-Agent 섞어가며 사용 (간단한 회피)
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36"
]

def fetch_bing_first_image_url(query, max_retries=3):
    """Bing 이미지 검색 페이지에서 첫 번째 결과의 원본 이미지 URL(murl)을 추출"""
    search_url = "https://www.bing.com/images/search"
    params = {"q": query, "form": "HDRSC2", "first": "1", "tsc": "ImageBasicHover"}
    headers = {
        "User-Agent": random.choice(HEADERS_LIST),
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://www.bing.com/"
    }

    for attempt in range(1, max_retries + 1):
        try:
            resp = requests.get(search_url, params=params, headers=headers, timeout=8)
            if resp.status_code != 200:
                # 짧은 지연 후 재시도
                time.sleep(1 + attempt * 0.5)
                continue

            soup = BeautifulSoup(resp.text, "html.parser")

            # Bing 이미지 결과의 각 항목은 <a class="iusc" m="...json...">
            a = soup.select_one("a.iusc")
            if not a:
                # 다른 selector 시도: 이미지 태그 중에서 data-src 또는 src가 있는 것
                img_tag = soup.select_one("img.mimg, img.iusc, img")
                if img_tag:
                    src = img_tag.get("data-src") or img_tag.get("src")
                    if src and src.startswith("http"):
                        return src
                return None

            m_attr = a.get("m")
            if not m_attr:
                return None

            # m 속성은 JSON 형태 문자열. 그 안의 "murl"이 원본 이미지 URL
            try:
                mjson = json.loads(m_attr)
                murl = mjson.get("murl")
                if murl:
                    return murl
            except Exception:
                # 파싱 실패 시 fallback: a 태그 내부 img src 찾기
                img = a.select_one("img")
                if img:
                    src = img.get("data-src") or img.get("src")
                    if src and src.startswith("http"):
                        return src

            return None

        except requests.RequestException as e:
            # 네트워크/타임아웃 일시적 실패: 재시도
            if attempt == max_retries:
                return None
            time.sleep(1 + attempt * 0.8)
    return None


def main():
    if not INPUT_PATH.exists():
        print(f"Error: 입력 파일을 찾을 수 없습니다: {INPUT_PATH}")
        return

    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        movies = json.load(f)

    updated = []
    for idx, movie in enumerate(movies, start=1):
        title = movie.get("title") or movie.get("name") or ""
        if not title:
            print(f"[{idx}] 스킵: 제목 없음")
            updated.append(movie)
            continue

        query = f"{title} 포스터"  # 검색어: 영화제목 + 포스터
        print(f"[{idx}/{len(movies)}] 검색: {title}")

        new_url = fetch_bing_first_image_url(query)
        if new_url:
            print(f"  ✅ 찾음: {new_url}")
            movie["imgUrl"] = new_url  # 기존 필드 유지, imgUrl만 교체
        else:
            print("  ⚠️ 실패: 이미지 못 찾음 — 기존 imgUrl 유지")
        updated.append(movie)

        # 차단 방지: 랜덤한 지연 (1.0 ~ 2.5초)
        time.sleep(1.0 + random.random() * 1.5)

    # 결과 저장
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(updated, f, ensure_ascii=False, indent=2)

    print(f"\n완료! 결과 파일: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

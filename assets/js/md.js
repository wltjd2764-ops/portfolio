// data-md="경로.md" 속성이 있는 요소에 Markdown 파일을 렌더링한다.
document.querySelectorAll("[data-md]").forEach(async el => {
  try {
    const res = await fetch(el.dataset.md, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    el.innerHTML = marked.parse(await res.text());
    el.querySelectorAll('a[href^="http"]').forEach(a => { a.target = "_blank"; a.rel = "noopener"; });
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
  } catch (e) {
    el.innerHTML = `<p class="empty">기록을 불러오지 못했습니다.</p>`;
  }
});

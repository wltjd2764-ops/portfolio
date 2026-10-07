// 교과목 목록(academics.html)과 상세(course.html?c=slug)를 그린다.
// 목록 정보는 data/courses.json, 본문은 courses/<slug>.md 에 있다.
(async function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let courses = [];
  try {
    courses = await (await fetch("data/courses.json", { cache: "no-store" })).json();
  } catch (e) {}

  const list = document.getElementById("course-list");
  if (list) {
    if (!courses.length) {
      list.innerHTML = `<div class="prose"><div class="pending">작성 예정 — 수강한 과목 목록</div></div>`;
      return;
    }
    const FILTERS = { "전체": () => true, "전공": c => c.category.startsWith("전공"), "교양 · 일반": c => !c.category.startsWith("전공") };
    let active = "전체";
    const filterBar = document.createElement("div");
    filterBar.className = "course-filter";
    list.before(filterBar);
    filterBar.addEventListener("click", e => {
      const b = e.target.closest(".chip");
      if (b) { active = b.dataset.f; render(); }
    });

    function render() {
      filterBar.innerHTML = Object.keys(FILTERS).map(f =>
        `<button class="chip" data-f="${f}" aria-pressed="${f === active}">${f} ${courses.filter(FILTERS[f]).length}</button>`).join("");
      // 학기별로 묶는다 (courses.json에 적힌 순서 유지)
      const groups = new Map();
      courses.filter(FILTERS[active]).forEach(c => {
        if (!groups.has(c.semester)) groups.set(c.semester, []);
        groups.get(c.semester).push(c);
      });
      list.innerHTML = [...groups].map(([sem, items]) => `
      <div class="course-group">
        <h3 class="course-sem">${esc(sem)}</h3>
        <div class="course-rows">
          ${items.map(c => `
            <a class="course-row" href="course.html?c=${encodeURIComponent(c.slug)}">
              <span class="course-name">${esc(c.name)}</span>
              <span class="course-cat">${esc(c.category)}</span>
              <span class="course-num">${esc(c.credits)}학점</span>
              <span class="project-arrow">→</span>
            </a>`).join("")}
        </div>
      </div>`).join("");
    }
    render();
    return;
  }

  const slug = new URLSearchParams(location.search).get("c");
  const c = courses.find(x => x.slug === slug);
  const head = document.getElementById("course-head");
  const body = document.getElementById("course-body");
  if (!c) {
    body.innerHTML = `<p class="empty">과목을 찾을 수 없습니다.</p>`;
    return;
  }

  document.title = `장지성 | ${c.name}`;
  head.insertAdjacentHTML("beforeend", `
    <p class="eyebrow">${esc(c.category)} · ${esc(c.semester)}</p>
    <h1 class="project-title">${esc(c.name)}</h1>
    <dl class="project-facts">
      <div><dt>학점</dt><dd>${esc(c.credits)}</dd></div>
      <div><dt>성적</dt><dd>비공개</dd></div>
      ${c.professor ? `<div><dt>교수</dt><dd>${esc(c.professor)}</dd></div>` : ""}
    </dl>`);

  // 아직 기록 파일(courses/<slug>.md)이 없는 과목은 빈 칸 구성을 보여준다
  const EMPTY = [
    ["과목 소개", "어떤 내용을 다루는 과목인지"],
    ["배운 것", "핵심 개념, 새로 알게 된 것"],
    ["느낀 점", "어려웠던 점, 흥미로웠던 점, 직무와 연결되는 부분"],
    ["공부 자료", "정리 노트, 참고 도서, 강의 자료"],
    ["제출한 과제", "과제명, 한 줄 설명, 파일"],
  ].map(([h, d]) => `<h2>${h}</h2><div class="pending">작성 예정 — ${d}</div>`).join("");

  try {
    const res = await fetch(`courses/${encodeURIComponent(slug)}.md`, { cache: "no-store" });
    body.innerHTML = res.ok ? marked.parse(await res.text()) : EMPTY;
    body.querySelectorAll('a[href^="http"]').forEach(a => { a.target = "_blank"; a.rel = "noopener"; });
  } catch (e) {
    body.innerHTML = EMPTY;
  }
})();

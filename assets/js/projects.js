// 프로젝트 목록(projects.html)과 상세(project.html?p=slug)를 그린다.
// 목록 정보는 data/projects.json, 본문은 projects/<slug>.md 에 있다.
(async function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let projects = [];
  try {
    projects = await (await fetch("data/projects.json", { cache: "no-store" })).json();
  } catch (e) {}

  const aiList = document.getElementById("ai-list");
  if (aiList) {
    const ai = projects.filter(p => p.ai);
    const tools = [...new Set(ai.flatMap(p => p.tools || []))];
    document.getElementById("ai-tools").innerHTML = tools.map(t => `<span class="ai-chip">${esc(t)}</span>`).join("");
    document.getElementById("ai-count").textContent = ai.length;
    aiList.innerHTML = ai.length ? ai.map(p => `
      <a class="ai-card" href="project.html?p=${encodeURIComponent(p.slug)}">
        ${p.cover ? `<div class="ai-cover"><img src="${esc(p.cover)}" alt="" loading="lazy"></div>` : ""}
        <div class="ai-card-top"><span class="ai-badge">AI</span><span>${esc(p.period)}</span></div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.summary)}</p>
        <div class="ai-tools">${(p.tools || []).map(t => `<span class="ai-chip">${esc(t)}</span>`).join("")}</div>
        <span class="ai-arrow">기록 보기 →</span>
      </a>`).join("") : `<p class="empty">아직 등록된 AI 활용 기록이 없습니다.</p>`;
  }

  const list = document.getElementById("project-list");
  if (list) {
    const regular = projects.filter(p => !p.ai);
    list.innerHTML = regular.length ? regular.map(p => `
      <a class="project-row" href="project.html?p=${encodeURIComponent(p.slug)}">
        <div class="project-meta">
          <span class="tl-date">${esc(p.period)}</span>
          <span class="tag">${esc(p.type)}</span>
        </div>
        <div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.summary)}</p>
          ${p.result ? `<div class="project-result">${esc(p.result)}</div>` : ""}
        </div>
        <span class="project-arrow">→</span>
      </a>`).join("") : `<p class="empty">아직 등록된 프로젝트가 없습니다.</p>`;
    return;
  }

  const slug = new URLSearchParams(location.search).get("p");
  const p = projects.find(x => x.slug === slug);
  const head = document.getElementById("project-head");
  const body = document.getElementById("project-body");
  if (!p) {
    body.innerHTML = `<p class="empty">프로젝트를 찾을 수 없습니다.</p>`;
    return;
  }

  document.title = `장지성 | ${p.title}`;
  head.insertAdjacentHTML("beforeend", `
    <p class="eyebrow">${esc(p.type)} · ${esc(p.period)}</p>
    <h1 class="project-title">${esc(p.title)}</h1>
    <dl class="project-facts">
      ${p.team ? `<div><dt>팀</dt><dd>${esc(p.team)}</dd></div>` : ""}
      ${p.context ? `<div><dt>수업</dt><dd><a class="fact-link" href="course.html?c=10-02">${esc(p.context)}</a></dd></div>` : ""}
      ${p.tools ? `<div><dt>도구</dt><dd>${p.tools.map(t => `<span class="ai-chip light">${esc(t)}</span>`).join(" ")}</dd></div>` : ""}
      ${p.result ? `<div><dt>결과</dt><dd>${esc(p.result)}</dd></div>` : ""}
    </dl>
    <div class="tags">${(p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>`);

  try {
    const res = await fetch(`projects/${encodeURIComponent(slug)}.md`, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    body.innerHTML = marked.parse(await res.text());
    body.querySelectorAll('a[href^="http"]').forEach(a => { a.target = "_blank"; a.rel = "noopener"; });
  } catch (e) {
    body.innerHTML = `<p class="empty">기록을 불러오지 못했습니다.</p>`;
  }
})();

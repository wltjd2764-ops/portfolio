// data/news.json(매일 GitHub Actions가 생성)을 읽어 카테고리별로 보여준다.
(async function () {
  const list = document.getElementById("news-list");
  const chips = document.getElementById("chips");
  const updated = document.getElementById("updated");

  let data;
  try {
    const res = await fetch("data/news.json", { cache: "no-store" });
    data = await res.json();
  } catch (e) {
    list.innerHTML = `<p class="empty">뉴스를 불러오지 못했습니다.</p>`;
    return;
  }

  const items = data.items || [];
  const categories = ["전체", ...(data.categories || [])];
  const wanted = new URLSearchParams(location.search).get("cat");
  let active = categories.includes(wanted) ? wanted : "전체";

  if (data.updated) {
    const d = new Date(data.updated);
    updated.textContent = `업데이트 ${d.toLocaleString("ko-KR", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
  }

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = iso => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")}`;
  };

  function renderChips() {
    chips.innerHTML = categories.map(c => {
      const n = c === "전체" ? items.length : items.filter(i => i.category === c).length;
      return `<button class="chip" aria-pressed="${c === active}" data-cat="${esc(c)}">${esc(c)} ${n}</button>`;
    }).join("");
  }

  function renderList() {
    const shown = active === "전체" ? items : items.filter(i => i.category === active);
    if (!shown.length) {
      list.innerHTML = `<p class="empty">표시할 기사가 없습니다.</p>`;
      return;
    }
    list.innerHTML = shown.map(i => `
      <a class="news-item" href="${esc(i.link)}" target="_blank" rel="noopener">
        <div>
          <h3>${esc(i.title)}</h3>
          <div class="meta"><span class="cat">${esc(i.category)}</span><span>${esc(i.source || "")}</span></div>
        </div>
        <time datetime="${esc(i.published)}">${fmt(i.published)}</time>
      </a>`).join("");
  }

  chips.addEventListener("click", e => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    active = btn.dataset.cat;
    renderChips();
    renderList();
  });

  renderChips();
  renderList();
})();

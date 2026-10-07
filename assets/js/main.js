// 공통 헤더/푸터를 모든 페이지에 삽입한다. 메뉴를 바꿀 때는 여기만 수정하면 된다.
const SITE = {
  name: "장지성",
  role: "Architectural Engineering",
  github: "https://github.com/wltjd2764-ops",
  pages: [
    { href: "index.html", label: "소개" },
    { href: "academics.html", label: "학교생활" },
    { href: "certifications.html", label: "자격증" },
    { href: "activities.html", label: "수상 · 경력" },
    { href: "projects.html", label: "프로젝트 기록" },
    { href: "interests.html", label: "관심사" },
    { href: "news.html", label: "건축 뉴스" },
  ],
};

(function applySavedTheme() {
  try {
    const t = localStorage.getItem("theme");
    if (t) document.documentElement.dataset.theme = t;
  } catch (e) {}
})();

document.addEventListener("DOMContentLoaded", () => {
  let current = location.pathname.split("/").pop() || "index.html";
  // 상세 페이지도 목록 메뉴를 강조
  if (current === "project.html") current = "projects.html";
  if (current === "course.html") current = "academics.html";

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="container">
      <a class="logo" href="index.html">${SITE.name}<span>${SITE.role}</span></a>
      <div style="display:flex;align-items:center">
        <nav class="nav" id="nav">
          ${SITE.pages.map(p => `<a href="${p.href}" class="${p.href === current ? "active" : ""}">${p.label}</a>`).join("")}
        </nav>
        <button class="icon-btn" id="theme-btn" aria-label="테마 전환">◐</button>
        <button class="icon-btn menu-btn" id="menu-btn" aria-label="메뉴">☰</button>
      </div>
    </div>`;
  document.body.prepend(header);

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container">
      <span>© ${new Date().getFullYear()} ${SITE.name}</span>
      <a href="${SITE.github}" target="_blank" rel="noopener">GitHub</a>
    </div>`;
  document.body.append(footer);

  document.getElementById("menu-btn").addEventListener("click", () => {
    document.getElementById("nav").classList.toggle("open");
  });

  document.getElementById("theme-btn").addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = isDark ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-item[data-scroll-to]");
  const toTopBtn = document.getElementById("toTopBtn");
  const themeToggleBtn = document.getElementById("themeToggle");
  const body = document.body;

  const smoothScrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 72;
    const rect = el.getBoundingClientRect();
    const offsetTop = rect.top + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetTop < 0 ? 0 : offsetTop,
      behavior: "smooth",
    });
  };

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.scrollTo;
      smoothScrollTo(targetId);
    });
  });

  toTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Theme toggle
  const applyTheme = (theme) => {
    if (theme === "retro") {
      body.classList.remove("theme-modern");
      body.classList.add("theme-retro");
      if (themeToggleBtn) themeToggleBtn.textContent = "Modern";
    } else {
      body.classList.remove("theme-retro");
      body.classList.add("theme-modern");
      if (themeToggleBtn) themeToggleBtn.textContent = "Retro";
    }
  };

  const savedTheme = window.localStorage.getItem("portfolio-theme");
  if (savedTheme === "retro" || savedTheme === "modern") {
    applyTheme(savedTheme);
  } else {
    applyTheme("modern");
  }

  themeToggleBtn?.addEventListener("click", () => {
    const nextTheme = body.classList.contains("theme-retro")
      ? "modern"
      : "retro";
    applyTheme(nextTheme);
    window.localStorage.setItem("portfolio-theme", nextTheme);
  });
});

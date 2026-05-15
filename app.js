(function () {
  const html = document.documentElement;
  const currentPath = window.location.pathname.replace(/\/index\.html$/, "/");

  function setActiveNav() {
    document.querySelectorAll(".primary-nav a").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const url = new URL(href, window.location.href);
      if (url.pathname.replace(/\/index\.html$/, "/") === currentPath) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function setupRecipeFilters() {
    const filterButtons = document.querySelectorAll("[data-filter]");
    const recipeItems = document.querySelectorAll("[data-recipe-type]");
    if (!filterButtons.length || !recipeItems.length) return;

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
        recipeItems.forEach((item) => {
          item.hidden = !(filter === "All" || item.dataset.recipeType === filter);
        });
      });
    });
  }

  function setupSimpleContactForm() {
    const contactForm = document.querySelector("[data-contact-form]");
    const contactStatus = document.querySelector("[data-contact-status]");
    if (!contactForm || !contactStatus) return;

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const subject = encodeURIComponent(`njoooy inquiry: ${data.get("topic") || "general"}`);
      const body = encodeURIComponent(
        [
          `Name: ${data.get("name") || ""}`,
          `Email: ${data.get("email") || ""}`,
          `Topic: ${data.get("topic") || ""}`,
          "",
          data.get("message") || "",
        ].join("\n"),
      );
      contactStatus.textContent = "メールアプリを開きます。送信前に内容をご確認ください。";
      window.location.href = `mailto:hello@njoooy.com?subject=${subject}&body=${body}`;
    });
  }

  function setupLegacyPreloader() {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    const hide = () => {
      preloader.style.opacity = "0";
      preloader.style.pointerEvents = "none";
      window.setTimeout(() => {
        preloader.style.display = "none";
      }, 250);
    };

    if (document.readyState === "complete") {
      window.setTimeout(hide, 3200);
    } else {
      window.addEventListener("load", () => window.setTimeout(hide, 3200), { once: true });
    }
  }

  function setupReveal() {
    const revealItems = document.querySelectorAll(".reveal");
    if (!revealItems.length) return;

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.08 },
    );

    revealItems.forEach((item) => observer.observe(item));
    window.setTimeout(() => revealItems.forEach((item) => item.classList.add("in")), 1200);
  }

  function setupScrollProgress() {
    const progress = document.getElementById("scrollProgress");
    const current = document.getElementById("scrollIndexCurrent");
    const total = document.getElementById("scrollIndexTotal");
    const sections = document.querySelectorAll("main section");

    if (total) total.textContent = String(sections.length || 1).padStart(2, "0");

    const update = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      if (progress) progress.style.width = `${(doc.scrollTop / max) * 100}%`;

      if (current && sections.length) {
        let activeIndex = 0;
        const anchor = window.innerHeight * 0.34;
        sections.forEach((section, index) => {
          if (section.getBoundingClientRect().top <= anchor) activeIndex = index;
        });
        current.textContent = String(activeIndex + 1).padStart(2, "0");
      }
    };

    if (progress || current) {
      document.addEventListener("scroll", update, { passive: true });
      update();
    }
  }

  function setupLanguageToggle() {
    const toggle = document.getElementById("nav-lang-toggle");
    if (!toggle) return;

    const updatePlaceholders = (lang) => {
      const attr = lang === "en" ? "data-ph-en" : "data-ph-ja";
      document.querySelectorAll("[data-ph-ja], [data-ph-en]").forEach((field) => {
        const value = field.getAttribute(attr);
        if (value !== null) field.setAttribute("placeholder", value);
      });
    };

    const applyLang = (lang) => {
      const nextLang = lang === "en" ? "en" : "ja";
      html.setAttribute("lang", nextLang);
      toggle.querySelectorAll("[data-lang]").forEach((item) => {
        item.setAttribute("data-active", item.dataset.lang === nextLang ? "true" : "false");
      });
      updatePlaceholders(nextLang);
      try {
        localStorage.setItem("njoooy-lang", nextLang);
      } catch (_) {
        // Storage may be unavailable in some preview contexts.
      }
      document.dispatchEvent(new CustomEvent("njoooy:langchange", { detail: { lang: nextLang } }));
    };

    try {
      const saved = localStorage.getItem("njoooy-lang");
      if (saved === "ja" || saved === "en") applyLang(saved);
    } catch (_) {
      updatePlaceholders(html.getAttribute("lang") || "ja");
    }

    toggle.addEventListener("click", () => {
      applyLang((html.getAttribute("lang") || "ja") === "ja" ? "en" : "ja");
    });
  }

  function setupLegacyContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("contact-form-status");
    if (!form || !status) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submitButton = form.querySelector(".form-submit, .contact-form-submit");
      const originalLabel = submitButton ? submitButton.innerHTML : "";
      const isEnglish = html.getAttribute("lang") === "en";

      const messages = {
        sending: isEnglish ? "Sending..." : "送信中...",
        success: isEnglish ? "Message sent. We'll reply within 24 hours." : "送信完了しました。24時間以内にご返信いたします。",
        fail: isEnglish
          ? "Submission failed. Please email hello@njoooy.com directly."
          : "送信に失敗しました。hello@njoooy.com へ直接ご連絡ください。",
      };

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = messages.sending;
      }
      status.className = "contact-form-status";
      status.textContent = "";

      try {
        if (!form.action || form.action === window.location.href) throw new Error("Missing form action");
        const payload = Object.fromEntries(new FormData(form).entries());
        const response = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) throw new Error("Form submission failed");
        status.textContent = messages.success;
        status.classList.add("success");
        form.reset();
      } catch (_) {
        status.textContent = messages.fail;
        status.classList.add("error");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalLabel;
        }
      }
    });
  }

  function setupMeetingPickerFallback() {
    const picker = document.getElementById("mtg-picker");
    if (!picker) return;
    const label = document.getElementById("mtg-month-label");
    const days = document.getElementById("mtg-days");
    const timesLabel = document.getElementById("mtg-times-label");
    const times = document.getElementById("mtg-times-grid");
    if (label && !label.textContent) label.textContent = "日程候補";
    if (days && !days.children.length) {
      const today = new Date();
      for (let index = 1; index <= 14; index += 1) {
        const date = new Date(today);
        date.setDate(today.getDate() + index);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "mtg-day";
        button.textContent = String(date.getDate());
        button.addEventListener("click", () => {
          document.querySelectorAll(".mtg-day-selected").forEach((item) => item.classList.remove("mtg-day-selected"));
          button.classList.add("mtg-day-selected");
          if (timesLabel) timesLabel.textContent = `${date.getMonth() + 1}/${date.getDate()} の時間帯`;
          if (times) {
            times.innerHTML = "";
            [10, 13, 16, 19].forEach((hour) => {
              const timeButton = document.createElement("button");
              timeButton.type = "button";
              timeButton.className = "mtg-time";
              timeButton.textContent = `${String(hour).padStart(2, "0")}:00`;
              times.appendChild(timeButton);
            });
          }
        });
        days.appendChild(button);
      }
    }
  }

  function init() {
    setActiveNav();
    setupRecipeFilters();
    setupSimpleContactForm();
    setupLegacyPreloader();
    setupReveal();
    setupScrollProgress();
    setupLanguageToggle();
    setupLegacyContactForm();
    setupMeetingPickerFallback();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

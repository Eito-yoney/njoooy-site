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
        const payload = {};
        new FormData(form).forEach((value, key) => {
          if (typeof value === "string" && value.trim() === "" && key.startsWith("meeting_date_")) return;
          if (payload[key] === undefined) {
            payload[key] = value;
          } else {
            payload[key] = `${payload[key]}, ${value}`;
          }
        });
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
        const messageCount = document.getElementById("msgCount");
        if (messageCount) messageCount.textContent = "0";
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
    const pickedList = document.getElementById("mtg-picked-list");
    const prev = document.getElementById("mtg-prev");
    const next = document.getElementById("mtg-next");
    const hiddenFields = [1, 2, 3].map((index) => document.getElementById(`mtg-hidden-${index}`));
    if (!label || !days || !timesLabel || !times || !pickedList) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let selectedDate = null;
    let picks = [];

    const getLang = () => (html.getAttribute("lang") === "en" ? "en" : "ja");
    const pad = (value) => String(value).padStart(2, "0");
    const dateValue = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const timeValue = (hour) => `${pad(hour)}:00`;
    const isSameDate = (a, b) =>
      a &&
      b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
    const monthText = (date) =>
      getLang() === "en" ? `${date.toLocaleString("en-US", { month: "long" })} ${date.getFullYear()}` : `${date.getFullYear()}年${date.getMonth() + 1}月`;
    const dayText = (date) => (getLang() === "en" ? `${date.getMonth() + 1}/${date.getDate()}` : `${date.getMonth() + 1}/${date.getDate()}`);
    const pickLabel = (pick) => `${dayText(pick.date)} ${pick.time}`;

    const updateHiddenFields = () => {
      hiddenFields.forEach((field, index) => {
        if (field) field.value = picks[index] ? picks[index].value : "";
      });
    };

    const renderPicked = () => {
      pickedList.innerHTML = "";
      if (!picks.length) {
        const empty = document.createElement("div");
        empty.className = "meeting-picker-picked-empty";
        empty.textContent = getLang() === "en" ? "Optional. Tap a time slot to add it." : "任意です。時間帯をタップすると候補に追加されます。";
        pickedList.appendChild(empty);
        updateHiddenFields();
        return;
      }

      picks.forEach((pick, index) => {
        const item = document.createElement("div");
        item.className = "meeting-picker-picked-item";

        const number = document.createElement("span");
        number.className = "mtg-picked-no";
        number.textContent = `#${pad(index + 1)}`;

        const date = document.createElement("span");
        date.className = "mtg-picked-date";
        date.textContent = pickLabel(pick);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "mtg-picked-remove";
        remove.setAttribute("aria-label", getLang() === "en" ? "Remove this slot" : "この候補を削除");
        remove.textContent = "×";
        remove.addEventListener("click", () => {
          picks.splice(index, 1);
          updateHiddenFields();
          renderPicked();
          renderTimes();
        });

        item.append(number, date, remove);
        pickedList.appendChild(item);
      });
      updateHiddenFields();
    };

    const makePick = (date, hour) => {
      const time = timeValue(hour);
      return {
        date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        time,
        value: `${dateValue(date)} ${time}`,
      };
    };

    function renderTimes() {
      times.innerHTML = "";
      if (!selectedDate) {
        timesLabel.textContent = getLang() === "en" ? "Select a date" : "日付を選択してください";
        return;
      }

      timesLabel.textContent = getLang() === "en" ? `Slots for ${dayText(selectedDate)}` : `${dayText(selectedDate)} の時間帯`;
      [10, 13, 16, 19].forEach((hour) => {
        const pick = makePick(selectedDate, hour);
        const isPicked = picks.some((item) => item.value === pick.value);
        const timeButton = document.createElement("button");
        timeButton.type = "button";
        timeButton.className = isPicked ? "mtg-time mtg-time-picked" : "mtg-time";
        timeButton.setAttribute("aria-pressed", String(isPicked));
        timeButton.textContent = pick.time;
        timeButton.addEventListener("click", () => {
          const existingIndex = picks.findIndex((item) => item.value === pick.value);
          if (existingIndex >= 0) {
            picks.splice(existingIndex, 1);
          } else if (picks.length >= 3) {
            timeButton.classList.add("mtg-time-denied");
            window.setTimeout(() => timeButton.classList.remove("mtg-time-denied"), 380);
            return;
          } else {
            picks.push(pick);
          }
          updateHiddenFields();
          renderPicked();
          renderTimes();
        });
        times.appendChild(timeButton);
      });
    }

    function renderDays() {
      days.innerHTML = "";
      label.textContent = monthText(currentMonth);

      const firstDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      for (let index = 0; index < firstDate.getDay(); index += 1) {
        const empty = document.createElement("button");
        empty.type = "button";
        empty.className = "mtg-day mtg-day-empty";
        empty.disabled = true;
        empty.setAttribute("aria-hidden", "true");
        days.appendChild(empty);
      }

      for (let day = 1; day <= lastDate.getDate(); day += 1) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const isPastOrToday = date <= today;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "mtg-day";
        button.textContent = String(day);
        button.disabled = isPastOrToday;
        button.setAttribute("aria-label", `${dateValue(date)}`);
        if (isPastOrToday) button.classList.add("mtg-day-past");
        if (isSameDate(date, today)) button.classList.add("mtg-day-today");
        if (isSameDate(date, selectedDate)) button.classList.add("mtg-day-selected");
        button.addEventListener("click", () => {
          selectedDate = date;
          renderDays();
          renderTimes();
        });
        days.appendChild(button);
      }

      if (prev) {
        const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        prev.disabled = currentMonth <= minMonth;
      }
    }

    if (prev) {
      prev.addEventListener("click", () => {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        selectedDate = null;
        renderDays();
        renderTimes();
      });
    }

    if (next) {
      next.addEventListener("click", () => {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        selectedDate = null;
        renderDays();
        renderTimes();
      });
    }

    const form = picker.closest("form");
    if (form) {
      form.addEventListener("reset", () => {
        window.setTimeout(() => {
          picks = [];
          selectedDate = null;
          updateHiddenFields();
          renderDays();
          renderTimes();
          renderPicked();
        }, 0);
      });
    }

    document.addEventListener("njoooy:langchange", () => {
      renderDays();
      renderTimes();
      renderPicked();
    });

    renderDays();
    renderTimes();
    renderPicked();
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

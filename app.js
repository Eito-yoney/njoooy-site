const currentPath = window.location.pathname.replace(/\/index\.html$/, "/");

document.querySelectorAll(".primary-nav a").forEach((link) => {
  const href = link.getAttribute("href");
  if (!href) return;
  const url = new URL(href, window.location.href);
  if (url.pathname === currentPath) {
    link.setAttribute("aria-current", "page");
  }
});

const filterButtons = document.querySelectorAll("[data-filter]");
const recipeItems = document.querySelectorAll("[data-recipe-type]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    recipeItems.forEach((item) => {
      const show = filter === "All" || item.dataset.recipeType === filter;
      item.hidden = !show;
    });
  });
});

const contactForm = document.querySelector("[data-contact-form]");
const contactStatus = document.querySelector("[data-contact-status]");

 
function () {
  const pre = document.getElementById('preloader');
  // [edit] Preloader: 同一セッションのリピート訪問では即座に閉じる(初回のみフル演出)
  let preloaderSeen = false;
  try { preloaderSeen = sessionStorage.getItem('njoooy-preloader-seen') === '1'; } catch(e) {}
  if (preloaderSeen) {
    if (pre) pre.style.display = 'none';
  } else {
    setTimeout(() => { if (pre) pre.style.display = 'none'; }, 3200);
    try { sessionStorage.setItem('njoooy-preloader-seen', '1'); } catch(e) {}
  }

  // Scroll progress + scroll index
  const prog = document.getElementById('scrollProgress');
  const sIdxCurrent = document.getElementById('scrollIndexCurrent');
  const sIdxTotal = document.getElementById('scrollIndexTotal');
  const mainSections = document.querySelectorAll('main section');
  const totalSections = mainSections.length;
  if (sIdxTotal) sIdxTotal.textContent = String(totalSections).padStart(2, '0');

  function onScroll() {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    if (prog) prog.style.width = pct + '%';

    if (sIdxCurrent && mainSections.length) {
      const anchor = window.innerHeight * 0.33;
      let activeIdx = 0;
      mainSections.forEach((sec, i) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= anchor) activeIdx = i;
      });
      sIdxCurrent.textContent = String(activeIdx + 1).padStart(2, '0');
    }
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Nav light/dark based on scroll position
  const nav = document.getElementById('nav');
  const creamSections = document.querySelectorAll('.intro, .for-whom, .about-section, .past, .faq, .process, .archive, .method');
  function checkNav() {
    if (!nav) return;
    const top = window.scrollY + 60;
    let isLight = false;
    creamSections.forEach(s => {
      if (top >= s.offsetTop && top < s.offsetTop + s.offsetHeight) isLight = true;
    });
    if (isLight) nav.classList.add('light');
    else nav.classList.remove('light');
  }
  document.addEventListener('scroll', checkNav, { passive: true });
  checkNav();

  // Reveal animations via IntersectionObserver
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  // Contact form (Web3Forms) — fetch-based submit + inline success/error
  const cf = document.getElementById('contact-form');
  const cfStatus = document.getElementById('contact-form-status');
  if (cf && cfStatus) {
    cf.addEventListener('submit', async function (e) {
      e.preventDefault();
      const submitBtn = cf.querySelector('.form-submit') || cf.querySelector('.contact-form-submit');
      const originalInner = submitBtn ? submitBtn.innerHTML : '';
      // [v8.31] lang-aware messages
      const isEn = (document.documentElement.getAttribute('lang') === 'en');
      const msgSending = isEn ? 'Sending…' : '送信中...';
      const msgSuccess = isEn
        ? '✓ Message sent. We\'ll reply within 24 hours.'
        : '✓ 送信完了しました。24時間以内にご返信いたします。';
      const msgFail = isEn
        ? '⚠ Submission failed. Please email hello@njoooy.com directly.'
        : '⚠ 送信に失敗しました。お手数ですが hello@njoooy.com へ直接ご連絡ください。';
      const msgNetErr = isEn
        ? '⚠ Network error. Please email hello@njoooy.com directly.'
        : '⚠ ネットワークエラーです。hello@njoooy.com へ直接ご連絡ください。';

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = msgSending; }
      cfStatus.className = 'contact-form-status';
      cfStatus.textContent = '';

      const formData = new FormData(cf);
      const payload = Object.fromEntries(formData.entries());

      try {
        const res = await fetch(cf.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json().catch(() => ({}));
        if (res.ok && result.success) {
          cfStatus.textContent = msgSuccess;
          cfStatus.classList.add('success');
          cf.reset();
        } else {
          cfStatus.textContent = msgFail;
          cfStatus.classList.add('error');
        }
      } catch (err) {
        cfStatus.textContent = msgNetErr;
        cfStatus.classList.add('error');
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalInner; }
      }
    });
  }

  // v7.10: inactive link guard (Instagram 準備中 など)
  document.querySelectorAll('[data-inactive="true"]').forEach(el => {
    el.addEventListener('click', function (ev) {
      // href="#contact" でデフォルト挙動
    });
  });

  // v8.27: Meeting Picker — 自前カレンダー UI
  (function initMeetingPicker() {
    const picker = document.getElementById('mtg-picker');
    if (!picker) return;
    const MAX_PICKS = 3;
    const HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    const WEEKDAY_JP = ['日', '月', '火', '水', '木', '金', '土'];
    const WEEKDAY_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const MONTH_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const state = {
      viewYear: now.getFullYear(),
      viewMonth: now.getMonth(),
      selected: [],
      activeDayBtn: null
    };
    const monthLabel = document.getElementById('mtg-month-label');
    const daysGrid = document.getElementById('mtg-days');
    const timesLabel = document.getElementById('mtg-times-label');
    const timesGrid = document.getElementById('mtg-times-grid');
    const pickedList = document.getElementById('mtg-picked-list');
    const prevBtn = document.getElementById('mtg-prev');
    const nextBtn = document.getElementById('mtg-next');

    // [v8.31] i18n helper — reads current html[lang] at call time
    function isEn() { return document.documentElement.getAttribute('lang') === 'en'; }
    function t(keys) { return isEn() ? keys.en : keys.ja; }

    function pad(n) { return String(n).padStart(2, '0'); }
    // [v8.31] fmtDate — always JP for hidden form values (backend consistency)
    function fmtDate(s) {
      const w = WEEKDAY_JP[new Date(s.year, s.month, s.day).getDay()];
      return `${s.year}/${pad(s.month + 1)}/${pad(s.day)} (${w}) ${pad(s.hour)}:00`;
    }
    // [v8.31] fmtDateDisplay — lang-aware for UI
    function fmtDateDisplay(s) {
      const dow = new Date(s.year, s.month, s.day).getDay();
      if (isEn()) {
        return `${s.year}/${pad(s.month + 1)}/${pad(s.day)} (${WEEKDAY_EN[dow]}) ${pad(s.hour)}:00`;
      }
      return `${s.year}/${pad(s.month + 1)}/${pad(s.day)} (${WEEKDAY_JP[dow]}) ${pad(s.hour)}:00`;
    }

    function renderCalendar() {
      monthLabel.textContent = isEn()
        ? `${MONTH_EN[state.viewMonth]} ${state.viewYear}`
        : `${state.viewYear} 年 ${state.viewMonth + 1} 月`;
      daysGrid.innerHTML = '';
      // prev ボタン disable(現在月以前)
      const isCurrentMonth = state.viewYear === now.getFullYear() && state.viewMonth === now.getMonth();
      prevBtn.disabled = isCurrentMonth;
      const firstWeekday = new Date(state.viewYear, state.viewMonth, 1).getDay();
      const lastDate = new Date(state.viewYear, state.viewMonth + 1, 0).getDate();
      for (let i = 0; i < firstWeekday; i++) {
        const e = document.createElement('span');
        e.className = 'mtg-day mtg-day-empty';
        daysGrid.appendChild(e);
      }
      for (let day = 1; day <= lastDate; day++) {
        const d = new Date(state.viewYear, state.viewMonth, day);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mtg-day';
        btn.textContent = day;
        if (d < today) {
          btn.classList.add('mtg-day-past');
          btn.disabled = true;
        } else {
          btn.addEventListener('click', () => selectDay(state.viewYear, state.viewMonth, day, btn));
        }
        if (d.getTime() === today.getTime()) btn.classList.add('mtg-day-today');
        daysGrid.appendChild(btn);
      }
      state.activeDayBtn = null;
      timesLabel.textContent = t({ ja: '日付を選択してください', en: 'Select a date' });
      timesGrid.innerHTML = '';
    }

    function selectDay(year, month, day, btn) {
      document.querySelectorAll('.mtg-day-selected').forEach(el => el.classList.remove('mtg-day-selected'));
      btn.classList.add('mtg-day-selected');
      state.activeDayBtn = btn;
      const dow = new Date(year, month, day).getDay();
      const w = isEn() ? WEEKDAY_EN[dow] : WEEKDAY_JP[dow];
      timesLabel.textContent = isEn()
        ? `Time slots on ${month + 1}/${day} (${w})`
        : `${month + 1}/${day} (${w}) の時間帯`;
      timesGrid.innerHTML = '';
      HOURS.forEach(hour => {
        const tb = document.createElement('button');
        tb.type = 'button';
        tb.className = 'mtg-time';
        tb.textContent = `${pad(hour)}:00`;
        const isPicked = state.selected.some(s => s.year === year && s.month === month && s.day === day && s.hour === hour);
        if (isPicked) tb.classList.add('mtg-time-picked');
        tb.addEventListener('click', () => toggleTime(year, month, day, hour, tb));
        timesGrid.appendChild(tb);
      });
    }

    function toggleTime(year, month, day, hour, btn) {
      const idx = state.selected.findIndex(s => s.year === year && s.month === month && s.day === day && s.hour === hour);
      if (idx >= 0) {
        state.selected.splice(idx, 1);
        btn.classList.remove('mtg-time-picked');
      } else {
        if (state.selected.length >= MAX_PICKS) {
          btn.classList.add('mtg-time-denied');
          setTimeout(() => btn.classList.remove('mtg-time-denied'), 400);
          return;
        }
        state.selected.push({ year, month, day, hour });
        btn.classList.add('mtg-time-picked');
      }
      renderPicked();
      updateHidden();
    }

    function renderPicked() {
      pickedList.innerHTML = '';
      if (state.selected.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'meeting-picker-picked-empty';
        empty.textContent = t({ ja: '時間帯をタップして追加してください', en: 'Tap a time slot to add it' });
        pickedList.appendChild(empty);
        return;
      }
      state.selected.forEach((s, i) => {
        const row = document.createElement('div');
        row.className = 'meeting-picker-picked-item';
        const no = document.createElement('span');
        no.className = 'mtg-picked-no';
        no.textContent = isEn() ? `Option ${i + 1}` : `第${i + 1}希望`;
        const dt = document.createElement('span');
        dt.className = 'mtg-picked-date';
        dt.textContent = fmtDateDisplay(s);
        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'mtg-picked-remove';
        rm.setAttribute('aria-label', t({ ja: '候補を削除', en: 'Remove pick' }));
        rm.textContent = '✕';
        rm.addEventListener('click', () => {
          state.selected.splice(i, 1);
          renderPicked();
          updateHidden();
          if (state.activeDayBtn) state.activeDayBtn.click();
        });
        row.appendChild(no);
        row.appendChild(dt);
        row.appendChild(rm);
        pickedList.appendChild(row);
      });
    }

    function updateHidden() {
      for (let i = 0; i < MAX_PICKS; i++) {
        const inp = document.getElementById(`mtg-hidden-${i + 1}`);
        if (!inp) continue;
        inp.value = i < state.selected.length ? fmtDate(state.selected[i]) : '';
      }
    }

    prevBtn.addEventListener('click', () => {
      if (prevBtn.disabled) return;
      state.viewMonth--;
      if (state.viewMonth < 0) { state.viewMonth = 11; state.viewYear--; }
      renderCalendar();
    });
    nextBtn.addEventListener('click', () => {
      state.viewMonth++;
      if (state.viewMonth > 11) { state.viewMonth = 0; state.viewYear++; }
      renderCalendar();
    });

    // [v8.31] Re-render on langchange so UI strings follow toggle
    document.addEventListener('njoooy:langchange', () => {
      renderCalendar();
      // If a day was selected, re-trigger to regenerate time label
      if (state.activeDayBtn) state.activeDayBtn.click();
      renderPicked();
    });

    renderCalendar();
  })();
}();

function(){
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const linkMap = {};
  navLinks.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    if (id) linkMap[id] = a;
  });

  let currentActive = null;
  function setActive(id) {
    if (currentActive === id) return;
    if (currentActive && linkMap[currentActive]) linkMap[currentActive].classList.remove('active');
    if (id && linkMap[id]) linkMap[id].classList.add('active');
    currentActive = id;
  }

  const observer = new IntersectionObserver((entries) => {
    let bestEntry = null;
    let bestTop = Infinity;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const rect = entry.target.getBoundingClientRect();
        if (rect.top < bestTop && rect.top < window.innerHeight * 0.4) {
          bestTop = rect.top;
          bestEntry = entry;
        }
      }
    });
    if (bestEntry) setActive(bestEntry.target.id);
  }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.1, 0.5, 1] });

  sections.forEach(sec => observer.observe(sec));

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        let best = null;
        let bestDist = Infinity;
        const target = window.innerHeight * 0.3;
        sections.forEach(sec => {
          const top = sec.getBoundingClientRect().top;
          if (top <= target && top > -sec.offsetHeight) {
            const dist = Math.abs(top - target);
            if (dist < bestDist) { bestDist = dist; best = sec; }
          }
        });
        if (best) setActive(best.id);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}();

// [v8.30] Language toggle — html[lang] 属性切替 + localStorage 永続化
// [v8.31] Extended: placeholders (data-ph-ja/en) + button labels swap on lang change
function(){
  const toggle = document.getElementById('nav-lang-toggle');
  if (!toggle) return;
  const STORAGE_KEY = 'njoooy-lang';
  const html = document.documentElement;

  function updatePlaceholders(lang) {
    const attr = lang === 'en' ? 'data-ph-en' : 'data-ph-ja';
    document.querySelectorAll('[data-ph-ja], [data-ph-en]').forEach(el => {
      const val = el.getAttribute(attr);
      if (val !== null) el.setAttribute('placeholder', val);
    });
  }

  function applyLang(lang) {
    if (lang !== 'ja' && lang !== 'en') lang = 'ja';
    html.setAttribute('lang', lang);
    const jaOpt = toggle.querySelector('[data-lang="ja"]');
    const enOpt = toggle.querySelector('[data-lang="en"]');
    if (jaOpt) jaOpt.setAttribute('data-active', lang === 'ja' ? 'true' : 'false');
    if (enOpt) enOpt.setAttribute('data-active', lang === 'en' ? 'true' : 'false');
    updatePlaceholders(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch(e) {}
    // [v8.31] Broadcast for dynamic components (meeting picker, form handler)
    document.dispatchEvent(new CustomEvent('njoooy:langchange', { detail: { lang } }));
  }

  // Restore saved preference (fallback to HTML-authored default)
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ja' || saved === 'en') applyLang(saved);
  } catch(e) {}

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('lang') || 'ja';
    applyLang(current === 'ja' ? 'en' : 'ja');
  });
}();

if (contactForm && contactStatus) {
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

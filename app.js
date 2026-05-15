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

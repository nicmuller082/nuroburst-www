const menu = document.getElementById("menu");
const nav = document.querySelector(".nav");
function setMenu(open) {
  nav?.classList.toggle("open", open);
  menu?.setAttribute("aria-expanded", String(open));
  if (menu) menu.textContent = open ? "Close" : "Menu";
}
menu?.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav?.classList.contains("open")) {
    setMenu(false);
    menu?.focus();
  }
});
document.addEventListener("click", (event) => {
  if (nav && !nav.contains(event.target)) setMenu(false);
});
window.matchMedia("(min-width: 1001px)").addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});

const form = document.getElementById("pilot-form");
 if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const body = [
      `Name: ${data.get("name") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `Company: ${data.get("company") || ""}`,
      `Team size: ${data.get("size") || ""}`,
      `What they train: ${data.get("train") || ""}`,
      "",
      data.get("note") || "",
    ].join("\n");
    window.location.href =
      "mailto:info@nuroburst.com?subject=" +
      encodeURIComponent("Nuroburst pilot") +
      "&body=" +
      encodeURIComponent(body);
  });
}

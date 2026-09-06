"use strict";
const menu = document.getElementById("menu");
const nav = document.querySelector(".nav");
const dropdowns = document.querySelectorAll(".nav-dropdown");
function setMenu(open) {
  nav?.classList.toggle("open", open);
  menu?.setAttribute("aria-expanded", String(open));
  if (menu) menu.textContent = open ? "Close" : "Menu";
  if (!open) dropdowns.forEach(item => { item.open = false; });
}
menu?.addEventListener("click", () => setMenu(!nav?.classList.contains("open")));
document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  const openDropdown = [...dropdowns].find(item => item.open);
  if (openDropdown) { openDropdown.open = false; openDropdown.querySelector("summary").focus(); }
  else if (nav?.classList.contains("open")) { setMenu(false); menu?.focus(); }
});
document.addEventListener("click", event => {
  if (nav && !nav.contains(event.target)) setMenu(false);
  else dropdowns.forEach(item => { if (!item.contains(event.target)) item.open = false; });
});
window.matchMedia("(min-width: 1101px)").addEventListener("change", event => {
  if (event.matches) setMenu(false);
});
const copyButton = document.querySelector("[data-copy-email]");
if (copyButton && navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    const status = document.querySelector(".copy-status");
    try { await navigator.clipboard.writeText("info@nuroburst.com"); status.textContent = "Email address copied."; }
    catch { status.textContent = "Please select and copy the email address above."; }
  });
}
const player = document.getElementById("sample-player");
if (player) {
  const byId = id => document.getElementById(id);
  const lesson = byId("sample-lesson"), question = byId("sample-question"), complete = byId("sample-complete");
  const answers = [...player.querySelectorAll("[data-answer]")];
  const feedback = byId("sample-feedback"), review = byId("sample-review"), start = byId("sample-start");
  function showStep(step) {
    [lesson, question, complete].forEach((panel, index) => { panel.hidden = index !== step; });
    byId("sample-step-label").textContent = ["1 / 3 · Learn", "2 / 3 · Recall", "3 / 3 · Review"][step];
    byId("sample-progress-fill").style.width = `${(step + 1) / 3 * 100}%`;
  }
  start.hidden = false;
  start.addEventListener("click", () => { showStep(1); byId("sample-question-title").focus(); });
  answers.forEach(answer => answer.addEventListener("click", () => {
    if (answer.disabled) return;
    answers.forEach(button => { button.disabled = true; });
    const correct = answer.dataset.answer === "b";
    answer.dataset.result = correct ? "correct" : "incorrect";
    feedback.textContent = correct
      ? "That’s right. This handover gives the status, the next action and its owner, and a deadline. Review the explanation to reinforce the idea."
      : "There’s a clearer option. A useful handover names the current status, the next action and its owner, and a deadline or risk. Review the example to see all three.";
    review.hidden = false;
  }));
  review.addEventListener("click", () => { showStep(2); byId("sample-complete-title").focus(); });
  byId("sample-restart").addEventListener("click", () => {
    answers.forEach(answer => { answer.disabled = false; delete answer.dataset.result; });
    feedback.textContent = ""; review.hidden = true; showStep(0); start.focus();
  });
}

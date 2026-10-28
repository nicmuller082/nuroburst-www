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

// WEB-01 (2026-10-13) - Nic: "can the GIF only start playing once in full view?
// So the user doesn't start at step 3?" Each walkthrough GIF shows a still of
// its first explainer card until most of it is on screen, then plays from step
// 1; scrolled away, it resets so it starts at step 1 again next time. Visitors
// who prefer reduced motion keep the still.
// WEB-ZOOM-01 (2026-10-28): the walkthroughs are now silent looping MP4s
// (zoomed on the action) - same rule: the poster (step 1's card) until 85% is
// on screen, then play from the start; below 15% pause and rewind. The file
// only starts loading once the video comes near the screen (preload="none" in
// the HTML, switched to "auto" here).
const walkthroughs = document.querySelectorAll("video.wb-video");
if (walkthroughs.length && "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const loader = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.preload = "auto";
        loader.unobserve(entry.target);
      }
    });
  }, { rootMargin: "600px 0px" });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.intersectionRatio >= 0.85 && video.paused) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else if (entry.intersectionRatio < 0.15 && !video.paused) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, { threshold: [0, 0.15, 0.85, 1] });
  walkthroughs.forEach(video => {
    loader.observe(video);
    observer.observe(video);
  });
}
// WEB-FORMS-01 (2026-10-21): "Request a demo" and "Contact us" send to the
// Nuroburst API and show the result on the page - no redirect.
const ENQUIRY_URL = "https://nuroburst-api.onrender.com/api/v1/public/enquiries";
document.querySelectorAll("form.enquiry-form").forEach(form => {
  const country = form.querySelector('select[name="phone_country"]');
  const countryShown = form.querySelector(".phone-country-shown");
  function showCountry() {
    const option = country.selectedOptions[0];
    countryShown.querySelector(".flag").textContent = option.textContent.split(" ")[0];
    countryShown.querySelector(".code").textContent = option.dataset.code;
  }
  country?.addEventListener("change", showCountry);
  const status = form.querySelector(".form-status");
  const button = form.querySelector('button[type="submit"]');
  const buttonHtml = button.innerHTML;
  function show(message, kind) {
    status.hidden = false;
    status.dataset.kind = kind;
    status.textContent = message;
  }
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    data.kind = form.dataset.kind;
    if (country) {
      // The email shows "+1 2815550100 (United States)".
      const option = country.selectedOptions[0];
      data.phone_code = option.dataset.code;
      data.phone_country = option.textContent.replace(/^\S+\s/, "").replace(/\s\(\+\d+\)$/, "");
    }
    button.disabled = true;
    button.textContent = "Sending…";
    status.hidden = true;
    try {
      const response = await fetch(ENQUIRY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(typeof body.detail === "string" ? body.detail
          : "Please check the details above and try again.");
      }
      const name = (data.name || "").split(" ")[0];
      const what = form.dataset.kind === "demo" ? "demo request" : "message";
      const done = document.createElement("div");
      done.className = "form-done";
      done.setAttribute("role", "status");
      done.setAttribute("tabindex", "-1");
      done.innerHTML = '<span class="form-done-mark" aria-hidden="true">✓</span><h3></h3><p></p>';
      done.querySelector("h3").textContent = `Thanks${name ? ", " + name : ""}. We’ve got your ${what}.`;
      done.querySelector("p").textContent =
        `We’ll reply within one business day. A copy is on its way to ${data.email}.`;
      form.replaceWith(done);
      done.focus();
    } catch (error) {
      show(error instanceof TypeError
        ? "We couldn’t reach our server. Please try again, or email info@nuroburst.com."
        : error.message, "error");
      button.disabled = false;
      button.innerHTML = buttonHtml;
    }
  });
});

document.getElementById("menu")?.addEventListener("click", () => {
  document.querySelector(".nav")?.classList.toggle("open");
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

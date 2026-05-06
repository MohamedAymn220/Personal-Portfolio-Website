document.addEventListener("DOMContentLoaded", () => {
  const clockElement = document.getElementById("clock");
  const typewriterElement = document.getElementById("typewriter");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function updateClock() {
    if (!clockElement) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
  }

  function runTypewriter() {
    if (!typewriterElement) return;

    let textData = typewriterElement.dataset.text?.trim() || "";
    let texts = [];

    try {
      texts = JSON.parse(textData);
      if (!Array.isArray(texts)) {
        texts = [textData];
      }
    } catch {
      texts = [textData];
    }

    if (!texts.length) return;

    if (prefersReducedMotion) {
      typewriterElement.textContent = texts[0];
      typewriterElement.classList.remove("is-typing");
      return;
    }

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingDelay = 90;
    const deletingDelay = 45;
    const pauseDelay = 2000;

    const tick = () => {
      const currentText = texts[textIndex];

      if (!isDeleting) {
        charIndex += 1;
        typewriterElement.textContent = currentText.slice(0, charIndex);

        if (charIndex === currentText.length) {
          isDeleting = true;
          window.setTimeout(tick, pauseDelay);
          return;
        }

        window.setTimeout(tick, typingDelay);
        return;
      }

      charIndex -= 1;
      typewriterElement.textContent = currentText.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        window.setTimeout(tick, 350);
        return;
      }

      window.setTimeout(tick, deletingDelay);
    };

    tick();
  }

  updateClock();
  window.setInterval(updateClock, 1000);
  runTypewriter();
});

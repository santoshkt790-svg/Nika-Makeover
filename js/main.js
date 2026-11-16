const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll("form[data-appointment-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const message = [
      "Hello Nika Makeover, I want to book an appointment.",
      "",
      `Name: ${formData.get("name") || ""}`,
      `Phone: ${formData.get("phone") || ""}`,
      `Service: ${formData.get("service") || ""}`,
      `Preferred Date: ${formData.get("date") || ""}`,
      `Preferred Time: ${formData.get("time") || ""}`,
      `Message: ${formData.get("message") || ""}`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/919899172324?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener");

    const note = form.querySelector(".form-note");
    if (note) {
      note.classList.add("show");
      note.textContent = "WhatsApp opened with your appointment details. Please send the message to confirm.";
    }
  });
});

document.querySelectorAll("[data-testimonial-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".testimonial-track");
  const cards = Array.from(carousel.querySelectorAll(".testimonial-card"));
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const dotsWrap = carousel.querySelector(".carousel-dots");
  let index = 0;
  let perView = 1;

  const getPerView = () => {
    if (window.matchMedia("(max-width: 820px)").matches) return 1;
    if (window.matchMedia("(max-width: 1040px)").matches) return 2;
    return 3;
  };

  const update = () => {
    perView = getPerView();
    const maxIndex = Math.max(cards.length - perView, 0);
    index = Math.min(index, maxIndex);
    const cardWidth = cards[0] ? cards[0].getBoundingClientRect().width : 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;

    if (dotsWrap) {
      dotsWrap.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => {
        dot.hidden = dotIndex > maxIndex;
        dot.classList.toggle("active", dotIndex === index);
        dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
      });
    }
  };

  if (dotsWrap) {
    cards.forEach((_, dotIndex) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Show review ${dotIndex + 1}`);
      dot.addEventListener("click", () => {
        index = dotIndex;
        update();
      });
      dotsWrap.appendChild(dot);
    });
  }

  prev?.addEventListener("click", () => {
    const maxIndex = Math.max(cards.length - perView, 0);
    index = index <= 0 ? maxIndex : index - 1;
    update();
  });

  next?.addEventListener("click", () => {
    const maxIndex = Math.max(cards.length - perView, 0);
    index = index >= maxIndex ? 0 : index + 1;
    update();
  });

  window.addEventListener("resize", update);
  update();
});

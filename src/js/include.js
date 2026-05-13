function getBasePath() {
  const path = window.location.pathname;

  if (path.includes("/src/pages/bioresonanz/")) {
    return "../../";
  }

  if (path.includes("/src/pages/")) {
    return "../";
  }

  if (path.includes("/src/")) {
    return "";
  }

  return "";
}

async function include(id, url) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.statusText);
    el.innerHTML = await r.text();

    initAfterIncludes();
  } catch (e) {
    console.error("Include-Fehler:", url, e);
  }
}

function initAfterIncludes() {
  setActiveMenu();
  initMobileMenu();
  initFaq();
  initContactForm();
  initBookingForm();

  if (document.getElementById("bookingDays")) {
    initAppointmentSelection();
  }

  initScrollTop();
  initRevealOnScroll();
  initSmoothAnchors();
}

function initAppointmentSelection() {
let currentMonth = 3; // April = 3 (0 = Januar)
let currentYear = 2026;
const today = new Date();
today.setHours(0, 0, 0, 0);

const monthNames = [
  "Januar","Februar","März","April","Mai","Juni",
  "Juli","August","September","Oktober","November","Dezember"
];

const monthTitle = document.getElementById("monthTitle");
const prevBtn = document.querySelectorAll(".booking-month-arrow")[0];
const nextBtn = document.querySelectorAll(".booking-month-arrow")[1];
const daysContainer = document.getElementById("bookingDays");

function renderDays() {
  daysContainer.innerHTML = "";

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const btn = document.createElement("button");

    const dateString = i + ". " + monthNames[currentMonth] + " " + currentYear;

    btn.textContent = i;
    btn.dataset.date = dateString;

    const dateObject = new Date(currentYear, currentMonth, i);

if (dateObject < today) {
  btn.disabled = true;
  btn.classList.add("disabled-day");
}

    btn.addEventListener("click", () => {
      document.querySelectorAll("#bookingDays button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      selectedDate = dateString;
      updateSummary();
    });

    daysContainer.appendChild(btn);
  }

  monthTitle.textContent = monthNames[currentMonth] + " " + currentYear;
}

prevBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderDays();
});

nextBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderDays();
});

  const dayButtons = document.querySelectorAll("#bookingDays button");
  const timeButtons = document.querySelectorAll("#bookingTimes button");
  const availabilityTitle = document.getElementById("availabilityTitle");
  const bookingSummary = document.getElementById("bookingSummary");
  const requestButton = document.getElementById("requestBookingBtn");
  const hint = document.getElementById("bookingHint");

  if (!dayButtons.length || !timeButtons.length || !requestButton) return;

  let selectedDate = "";
  let selectedTime = "";

  function updateSummary() {
    if (selectedDate) {
      availabilityTitle.textContent = "Verfügbarkeit für " + selectedDate;
    }

    if (selectedDate && selectedTime) {
      bookingSummary.innerHTML =
        selectedDate + " um " + selectedTime + "<br>Christian Harml<br>20 Min.";
      hint.textContent = "";
    }
  }

  dayButtons.forEach(button => {
    button.addEventListener("click", () => {
      dayButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      selectedDate = button.dataset.date;
      updateSummary();
    });
  });

  timeButtons.forEach(button => {
    button.addEventListener("click", () => {
      timeButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      selectedTime = button.dataset.time;
      updateSummary();
    });
  });

  requestButton.addEventListener("click", () => {
    if (!selectedDate || !selectedTime) {
      hint.textContent = "Bitte zuerst Datum und Uhrzeit auswählen.";
      return;
    }

    localStorage.setItem("bookingDate", selectedDate);
    localStorage.setItem("bookingTime", selectedTime);

    window.location.href = "/src/pages/buchung.html";
  });
}

function setActiveMenu() {
  const links = document.querySelectorAll(".nav a");
  const currentPath = window.location.pathname;

  links.forEach(link => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (!href) return;

    if (
      currentPath === href ||
      (href !== "/src/index.html" && currentPath.includes(href.replace("/src/", ""))) ||
      currentPath.endsWith(href.replace("/src/", ""))
    ) {
      link.classList.add("active");
    }
  });

  if (
    currentPath.endsWith("/src/index.html") ||
    currentPath.endsWith("/index.html") ||
    currentPath === "/src/" ||
    currentPath === "/"
  ) {
    const startLink = document.querySelector('.nav a[href="/src/index.html"]');
    if (startLink) startLink.classList.add("active");
  }
}

function initMobileMenu() {
  const header = document.querySelector(".site-header");
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (!header || !button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      header.classList.remove("menu-open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

function initFaq() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach(item => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!button || !answer) return;

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      items.forEach(other => {
        other.classList.remove("open");
        const otherBtn = other.querySelector(".faq-question");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      } else {
        button.setAttribute("aria-expanded", "false");
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  handleFormValidation(form, ["name", "email", "message"]);
}

function initBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const dateInput = document.getElementById("bookingDateInput");
  const timeInput = document.getElementById("bookingTimeInput");

  const bookingDate = localStorage.getItem("bookingDate") || "";
  const bookingTime = localStorage.getItem("bookingTime") || "";

  if (dateInput) dateInput.value = bookingDate;
  if (timeInput) timeInput.value = bookingTime;

  form.addEventListener("submit", (e) => {
    clearErrors(form);

    const firstName = form.querySelector("#firstName");
    const lastName = form.querySelector("#lastName");
    const email = form.querySelector("#email");

    let valid = true;

    if (!firstName.value.trim()) {
      showError(firstName, "Bitte Vorname eingeben.");
      valid = false;
    }

    if (!lastName.value.trim()) {
      showError(lastName, "Bitte Nachname eingeben.");
      valid = false;
    }

    if (!email.value.trim()) {
      showError(email, "Bitte E-Mail eingeben.");
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, "Bitte gültige E-Mail eingeben.");
      valid = false;
    }

    if (!bookingDate || !bookingTime) {
      alert("Bitte zuerst Datum und Uhrzeit auswählen.");
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
    }
  });
}

function handleFormValidation(form, requiredIds) {
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    clearErrors(form);
    let valid = true;

    requiredIds.forEach(id => {
      const field = form.querySelector(`#${id}`);
      if (!field) return;

      if (!field.value.trim()) {
        showError(field, "Bitte dieses Feld ausfüllen.");
        valid = false;
      }

      if (id === "email" && field.value.trim() && !isValidEmail(field.value.trim())) {
        showError(field, "Bitte gültige E-Mail eingeben.");
        valid = false;
      }
    });

    if (!valid) {
      if (status) {
        status.textContent = "Bitte die markierten Felder prüfen.";
        status.className = "form-status error";
      }
      return;
    }

    if (status) {
      status.textContent = "Demo erfolgreich: Formular wurde geprüft.";
      status.className = "form-status success";
    }

    form.reset();
  });
}

function showError(field, message) {
  field.classList.add("field-error");

  const error = document.createElement("div");
  error.className = "field-message";
  error.textContent = message;

  field.parentElement.appendChild(error);
}

function clearErrors(form) {
  form.querySelectorAll(".field-error").forEach(el => el.classList.remove("field-error"));
  form.querySelectorAll(".field-message").forEach(el => el.remove());
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function initScrollTop() {
  let button = document.getElementById("backToTop");

  if (!button) {
    button = document.createElement("button");
    button.id = "backToTop";
    button.className = "back-to-top";
    button.type = "button";
    button.textContent = "↑";
    button.setAttribute("aria-label", "Nach oben");
    document.body.appendChild(button);

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const toggleButton = () => {
    if (window.scrollY > 400) {
      button.classList.add("visible");
    } else {
      button.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", toggleButton);
  toggleButton();
}

function initRevealOnScroll() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function initTestimonialSlider() {
  const image = document.getElementById("testimonialImage");
  const prev = document.querySelector(".slider-btn.prev");
  const next = document.querySelector(".slider-btn.next");
  const dots = document.querySelectorAll(".slider-dots button");
  const text = document.getElementById("testimonialText");

  if (!image || !prev || !next) return;

  const images = [
    "bilder/Startseite/Erfahrung_Dr_KD.avif",
    "bilder/Startseite/Erfahrung_DrmedJH.avif",
    "bilder/Startseite/Erfahrung_HCS.avif",
    "bilder/Startseite/Erfahrung_Kira_ML.avif"
  ];
  const texts = [
  `Einen besonderen Dank dafür, daß Sie mich so erfolgreich zur Wiedererlangung bzw. Erhalt meiner Gesundheit kompetent und freundlich unterstützen.
  Ehrlich gesagt habe ich noch im Jänner des Jahres 2025 niemals daran geglaubt, dass Ihre Art der Behandlung irgendeinen Erfolg haben könnte!
  Sie haben eindrucksvoll das Gegenteil bewiesen und es wäre schön, wenn sich auch die Schulmedizin auf neues Terrain einlassen würde, da beide Methoden zusammen offensichtlich stärker und erfolgreicher sind.
  In diesem Sinne freue ich mich auf unsere weitere „Zusammenarbeit“ im Jahr 2026!
  Dr. K. D.`,
  `Durch einen Patienten, den Sie behandeln, habe ich während eines Krankenhausaufenthaltes in Salzburg, Ihre Adresse erfahren.
  Nun kann ich auf ein Jahr Behandlung durch Sie berichten:
  Nach einer BauchOP, die ca. 7 Stunden dauerte (10.Okt. 2024) und mit der Entfernung eines cystischen AdenoCA des Pankreas, einer Entfernung einer Metastase am Truncus cöliacus, sowie einer Lebermetastase, eingherging. Anschließend bekam ich eine Chemotherapie mit Gemcitabine, dabei stieg der Tumarker Ca19/9 auf über1600 Einheiten an, Wechsel der Chemotherapie auf Folferinox Anfang Feb. 2025 bis August 2025. Die Tumormarker fielen auf
  13,16 und zuletzt 17 Einheiten.
  Die Mitbehandlung durch Sie begann Mitte Januar 2025 vor Ort in Bischofshofen, die Intervallzeit wurde überbrückt durch ein kleines Gerät HOLOSAN, welches ich ständig bis dato benutze, inzwischen mit 3 verschiedenen Chips ( Leber, Energie, Herz).
  Ich als Mediziner bin fest davon überzeugt, daß Ihre Behandlung mit Bioresonanz beigetragen hat, daß mein Gesundheitszustand sich konsolidiert hat.
  Salzburg, 02.01.2026
  mit besten Grüßen
  Dr.med. J. H.`,
  `Sehr gute, professionelle Behandlung. 
  Das Team hat ein umfangreiches Wissen, ist sehr gut organisiert. 
  Dank der Bioresonanz bin ich wieder beschwerdefrei und hab meine Lebensqualität wieder.
  R.O.`,
  `Die Praxis von Christian ist nur sehr zu empfehlen, egal ob für Mensch oder Tier. 
  Ich bin bei ihm mit meiner Hündin Kira in Behandlung, da die französische Bulldogge an einer Futtermittelunverträglichkeit sowie Pollenallergie leidet. 
  Durch seine Hilfe konnten wir erfahren, dass der Hund auch eine schwere Gastritis hat. Nun haben wir seit 6 Wochen Behandlung bei Christian und es wird besser und besser.
  ML`
];

  let current = 0;

  function showSlide(index) {
    current = index;

    image.src = images[current];
    if (text) {
  text.textContent = texts[current];
}

    dots.forEach(dot => dot.classList.remove("active"));

    if (dots[current]) {
      dots[current].classList.add("active");
    }
  }

  prev.onclick = () => {
    let newIndex = current - 1;

    if (newIndex < 0) {
      newIndex = images.length - 1;
    }

    showSlide(newIndex);
  };

  next.onclick = () => {
    let newIndex = current + 1;

    if (newIndex >= images.length) {
      newIndex = 0;
    }

    showSlide(newIndex);
  };

  dots.forEach((dot, index) => {
    dot.onclick = () => {
      showSlide(index);
    };
  });

  showSlide(0);
}

document.addEventListener("DOMContentLoaded", () => {
  const basePath = getBasePath();

  include("site-header", `${basePath}partials/header.html`);
  include("site-footer", `${basePath}partials/footer.html`);
});

window.addEventListener("load", () => {
  initTestimonialSlider();
});
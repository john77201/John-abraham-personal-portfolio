/**
 * Portfolio — interactions & animations
 */

// ----- Apply config.js profile -----
function applyProfile() {
  if (typeof PROFILE === "undefined") return;
  const P = PROFILE;
  const full = `${P.firstName || ""} ${P.lastName || ""}`.trim() || "Your Name";

  document.title = `${full} | Portfolio`;
  document.querySelector('meta[name="description"]')?.setAttribute(
    "content",
    `${full} — ${P.title || "BCA Graduate Portfolio"}`
  );

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  };

  setText("heroName", full);
  setText("footerName", full);

  const logoName = document.getElementById("logoName");
  if (logoName && P.firstName && P.lastName) {
    logoName.innerHTML = `${P.firstName}<span class="logo-dot">.</span>${P.lastName}`;
  }

  const mailto = P.email || "your.email@example.com";
  const displayName = `${P.firstName || ""} ${P.lastName || ""}`.trim();
  const mailtoRecipient = displayName
    ? `${encodeURIComponent(displayName)}%20%3C${mailto}%3E`
    : mailto;
  document.querySelectorAll('[href^="mailto:"]').forEach((a) => {
    a.href = `mailto:${mailtoRecipient}`;
  });
  document.querySelectorAll(".contact-item").forEach((a, i) => {
    const span = a.querySelector("span:last-child");
    if (i === 0 && P.email) {
      if (span) span.textContent = P.email;
    }
    if (i === 1 && P.phone) {
      if (span) span.textContent = P.phone;
      a.href = `tel:${P.phone.replace(/[\s()-]+/g, "")}`;
    }
    if (i === 2 && P.location) {
      if (span) span.textContent = P.location;
      a.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(P.location)}`;
    }
  });

  const wire = (id, key) => {
    const el = document.getElementById(id);
    const url = P.links?.[key];
    if (!el) return;
    if (url) {
      el.href = url;
      el.classList.remove("social-hidden", "btn-disabled");
    } else {
      el.classList.add("social-hidden");
    }
  };

  wire("linkGithub", "github");
  wire("linkLinkedin", "linkedin");
  wire("linkTwitter", "twitter");
  wire("linkInstagram", "instagram");
  wire("linkLeetcode", "leetcode");
  wire("heroGithub", "github");
  wire("heroLinkedin", "linkedin");
  wire("heroFacebook", "facebook");
  wire("heroInstagram", "instagram");
  wire("heroWhatsapp", "whatsapp");
  wire("heroGmail", "gmail");

  const resumeBtn = document.querySelector(".about-text .btn-outline");
  if (resumeBtn && P.resumeUrl && P.resumeUrl !== "#") resumeBtn.href = P.resumeUrl;

  if (P.stats) {
    document.querySelectorAll(".stat-num").forEach((el, i) => {
      const vals = [P.stats.years, P.stats.projects, P.stats.technologies];
      if (vals[i] != null) el.dataset.count = vals[i];
    });
  }

  // Populate Education Timeline
  const timeline = document.getElementById("educationTimeline");
  if (timeline && P.education) {
    timeline.innerHTML = P.education.map((edu, i) => `
      <div class="timeline-item">
        <div class="timeline-marker">
          <div class="timeline-dot"></div>
          ${i < P.education.length - 1 ? '<div class="timeline-connector"></div>' : ''}
        </div>
        <div class="timeline-content">
          <span class="timeline-date">${edu.years}</span>
          <h3 class="timeline-degree">${edu.degree}</h3>
          <p class="timeline-institution">${edu.institution}</p>
          ${edu.details ? `<p class="timeline-details">${edu.details}</p>` : ''}
        </div>
      </div>
    `).join('');
  }
}

applyProfile();

// Terminal quick chips
document.querySelectorAll(".terminal-chip").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cmd = btn.dataset.cmd;
    if (cmd && window.portfolioTerminal) window.portfolioTerminal.execute(cmd);
    document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth" });
  });
});

// ----- Cursor glow -----
const cursorGlow = document.querySelector(".cursor-glow");
if (cursorGlow && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.addEventListener("mousemove", (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });
}

// ----- Nav scroll & mobile menu -----
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

navToggle?.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navLinks.classList.toggle("open");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle?.classList.remove("active");
    navLinks?.classList.remove("open");
  });
});

// ----- Typed headline -----
const typedPhrases =
  typeof PROFILE !== "undefined" && PROFILE.typedPhrases?.length
    ? PROFILE.typedPhrases
    : [
        "Software Developer",
        "Full Stack Enthusiast",
        "Problem Solver",
        "Creative Technologist",
      ];
const typedEl = document.getElementById("typedText");
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  if (!typedEl) return;
  const current = typedPhrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typedPhrases.length;
    delay = 400;
  }

  setTimeout(typeLoop, delay);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  typeLoop();
} else if (typedEl) {
  typedEl.textContent = typedPhrases[0];
}

// ----- Scroll reveal -----
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

revealEls.forEach((el) => revealObserver.observe(el));

// Hero reveals on load
requestAnimationFrame(() => {
  document.querySelectorAll(".hero .reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("visible"), 120 * i);
  });
});

// ----- Counter animation -----
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const num = entry.target.querySelector(".stat-num");
      const target = parseInt(num.dataset.count, 10);
      if (num && !num.dataset.done) {
        num.dataset.done = "1";
        animateCounter(num, target);
      }
      statObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".stat").forEach((s) => statObserver.observe(s));

// ----- Skill bars -----
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      const width = fill.dataset.width;
      fill.style.width = `${width}%`;
      barObserver.unobserve(fill);
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".skill-bar-fill").forEach((bar) => barObserver.observe(bar));

// ----- Custom Alert Dialog -----
let activeEscHandler = null;

function showCustomAlert(title, message) {
  const overlay = document.getElementById("alertOverlay");
  const titleEl = document.getElementById("alertTitle");
  const messageEl = document.getElementById("alertMessage");
  const btn = document.getElementById("alertBtn");
  const progress = document.getElementById("alertProgress");

  if (!overlay) return;

  if (title) titleEl.textContent = title;
  if (message) messageEl.textContent = message;

  // Reset animations
  overlay.classList.remove("show");
  progress.style.transition = "none";
  progress.style.transform = "scaleX(1)";

  // Force reflow
  void overlay.offsetWidth;

  // Show
  overlay.classList.add("show");
  
  // Animate progress bar (6 seconds) to drain
  progress.style.transition = "transform 6s linear";
  progress.style.transform = "scaleX(0)";

  // Remove existing listener if any
  if (activeEscHandler) {
    document.removeEventListener("keydown", activeEscHandler);
  }

  // Auto-close timeout
  const timeoutId = setTimeout(() => {
    closeCustomAlert();
  }, 6000);

  // Close handler
  const handleClose = () => {
    clearTimeout(timeoutId);
    closeCustomAlert();
  };

  btn.onclick = handleClose;
  overlay.onclick = (e) => {
    if (e.target === overlay) handleClose();
  };

  activeEscHandler = (e) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };
  document.addEventListener("keydown", activeEscHandler);
}

function closeCustomAlert() {
  const overlay = document.getElementById("alertOverlay");
  if (overlay) {
    overlay.classList.remove("show");
  }
  if (activeEscHandler) {
    document.removeEventListener("keydown", activeEscHandler);
    activeEscHandler = null;
  }
}

// ----- Contact form (mailto fallback) -----
const contactForm = document.getElementById("contactForm");
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get("name");
  const email = data.get("email");
  const subject = data.get("subject") || "Portfolio Contact";
  const message = data.get("message");
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`
  );
  const mailSubject = encodeURIComponent(subject);
  const displayName =
    typeof PROFILE !== "undefined" && PROFILE.firstName
      ? `${PROFILE.firstName || ""} ${PROFILE.lastName || ""}`.trim()
      : "";
  const mailto =
    typeof PROFILE !== "undefined" && PROFILE.email
      ? PROFILE.email
      : "your.email@example.com";
  const mailtoRecipient = displayName
    ? `${encodeURIComponent(displayName)}%20%3C${mailto}%3E`
    : mailto;
  
  // Show our beautiful custom alert first
  showCustomAlert(
    "Email Prepared!",
    `Thanks ${name}! We've opened your email app with a pre-filled draft. Just click "Send" to complete your inquiry.`
  );

  // Open the mail client after a brief delay to let the alert render and play its entry animation smoothly
  setTimeout(() => {
    window.location.href = `mailto:${mailtoRecipient}?subject=${mailSubject}&body=${body}`;
  }, 150);

  // Clear the form fields after submission
  contactForm.reset();
});

// ----- Footer year -----
document.getElementById("year").textContent = new Date().getFullYear();

// ----- Active nav link on scroll -----
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

window.addEventListener(
  "scroll",
  () => {
    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute("id");
    });
    navAnchors.forEach((a) => {
      a.style.color =
        a.getAttribute("href") === `#${current}`
          ? "var(--text)"
          : "";
    });
  },
  { passive: true }
);

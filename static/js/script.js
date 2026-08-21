/* =========================================================================
   RAJU TAILOR & PHOTOSTATE — SCRIPT
   Sections: preloader, ambient petal/particle canvas, nav behaviour,
   scroll reveals, animated counters, gallery lightbox, contact form.
   ========================================================================= */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
     PRELOADER
     ---------------------------------------------------------------------- */
  const preloader = document.getElementById("preloader");
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add("hidden");
    setTimeout(() => preloader.remove(), 700);
  }
  window.addEventListener("load", hidePreloader);
  // Safety net in case the load event is delayed by a slow resource.
  setTimeout(hidePreloader, 2500);

  /* ----------------------------------------------------------------------
     STICKY NAV — background/blur once the page has scrolled
     ---------------------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  function onScrollNav() {
    if (window.scrollY > 24) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ----------------------------------------------------------------------
     MOBILE HAMBURGER MENU
     ---------------------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");

  function closeMobileMenu() {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("no-scroll", isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobileMenu));

  /* ----------------------------------------------------------------------
     SCROLL REVEALS — fade/slide sections in as they enter the viewport
     ---------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ----------------------------------------------------------------------
     ANIMATED COUNTERS — run once each stat card scrolls into view
     ---------------------------------------------------------------------- */
  const counters = document.querySelectorAll("[data-count-to]");
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
    } else {
      requestAnimationFrame(tick);
    }
  }

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  /* ----------------------------------------------------------------------
     GALLERY LIGHTBOX
     ---------------------------------------------------------------------- */
  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCap = document.getElementById("lightbox-cap");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item = galleryItems[currentIndex];
    lightboxImg.src = item.getAttribute("data-img");
    lightboxImg.alt = item.getAttribute("data-title") || "Gallery image";
    lightboxCap.textContent = `${item.getAttribute("data-title")} — ${item.getAttribute("data-category")}`;
    lightbox.classList.add("open");
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  function showRelative(delta) {
    currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => showRelative(-1));
  lightboxNext.addEventListener("click", () => showRelative(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showRelative(-1);
    if (e.key === "ArrowRight") showRelative(1);
  });

  /* ----------------------------------------------------------------------
     CONTACT FORM — posts to the Flask /api/contact endpoint
     ---------------------------------------------------------------------- */
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formStatus.textContent = "Sending...";
    formStatus.className = "form-status";

    const payload = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        formStatus.textContent = data.message || "Thanks! We'll be in touch.";
        formStatus.className = "form-status ok";
        form.reset();
      } else {
        formStatus.textContent = data.error || "Something went wrong. Please try again.";
        formStatus.className = "form-status err";
      }
    } catch (err) {
      formStatus.textContent = "Could not send right now — please call or WhatsApp us instead.";
      formStatus.className = "form-status err";
    }
  });

  /* ----------------------------------------------------------------------
     AMBIENT CANVAS ANIMATION — falling cherry blossom petals + floating
     particles. Particle counts scale down on smaller / lower-end screens
     so the animation stays smooth everywhere.
     ---------------------------------------------------------------------- */
  const petalCanvas = document.getElementById("petal-canvas");
  const particleCanvas = document.getElementById("particle-canvas");

  if (petalCanvas && particleCanvas && !prefersReducedMotion) {
    const petalCtx = petalCanvas.getContext("2d");
    const particleCtx = particleCanvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function sizeCanvas(canvas, ctx) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      sizeCanvas(petalCanvas, petalCtx);
      sizeCanvas(particleCanvas, particleCtx);
    }
    resize();

    // Scale particle counts to screen size + device capability so low-end
    // / mobile devices don't get bogged down.
    const isSmallScreen = width < 768;
    const isLowPower = (navigator.hardwareConcurrency || 4) <= 4;
    const perfScale = isSmallScreen || isLowPower ? 0.45 : 1;

    const PETAL_COUNT = Math.round((isSmallScreen ? 16 : 30) * perfScale) || 8;
    const PARTICLE_COUNT = Math.round((isSmallScreen ? 18 : 36) * perfScale) || 10;

    const petalPalette = ["#f0c878", "#e8b98f", "#d9ac54", "#f2d3a8"];

    function rand(min, max) { return Math.random() * (max - min) + min; }

    class Petal {
      constructor() { this.reset(true); }
      reset(initial) {
        this.x = rand(0, width);
        this.y = initial ? rand(-height, height) : rand(-60, -10);
        this.size = rand(7, 15);
        this.speedY = rand(0.35, 0.9);
        this.speedX = rand(-0.3, 0.3);
        this.wind = rand(0.4, 1.1);
        this.windPhase = rand(0, Math.PI * 2);
        this.rotation = rand(0, Math.PI * 2);
        this.rotationSpeed = rand(-0.015, 0.015);
        this.opacity = rand(0.35, 0.85);
        this.color = petalPalette[Math.floor(rand(0, petalPalette.length))];
        this.sway = rand(20, 60);
      }
      update(time) {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(time * 0.001 + this.windPhase) * (this.wind * 0.35);
        this.rotation += this.rotationSpeed;
        if (this.y > height + 20 || this.x < -40 || this.x > width + 40) {
          this.reset(false);
        }
      }
      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        // simple petal shape: an ellipse pinched at one end
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size / 2, this.size / 2, 0, this.size);
        ctx.bezierCurveTo(-this.size / 2, this.size / 2, -this.size / 2, -this.size / 2, 0, -this.size / 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = rand(0, width);
        this.y = rand(0, height);
        this.size = rand(1, 2.6);
        this.speedY = rand(-0.15, -0.03);
        this.speedX = rand(-0.08, 0.08);
        this.opacity = rand(0.15, 0.5);
        this.pulse = rand(0, Math.PI * 2);
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.pulse += 0.02;
        if (this.y < -10) { this.y = height + 10; this.x = rand(0, width); }
      }
      draw(ctx) {
        const flicker = (Math.sin(this.pulse) + 1) / 2;
        ctx.globalAlpha = this.opacity * (0.6 + flicker * 0.4);
        ctx.fillStyle = "#f0c878";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const petals = Array.from({ length: PETAL_COUNT }, () => new Petal());
    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

    let lastFrame = 0;
    const targetInterval = 1000 / 60;

    function animate(time) {
      requestAnimationFrame(animate);
      if (time - lastFrame < targetInterval) return; // frame-rate throttle for consistency
      lastFrame = time;

      petalCtx.clearRect(0, 0, width, height);
      petals.forEach((p) => { p.update(time); p.draw(petalCtx); });
      petalCtx.globalAlpha = 1;

      particleCtx.clearRect(0, 0, width, height);
      particles.forEach((p) => { p.update(); p.draw(particleCtx); });
      particleCtx.globalAlpha = 1;
    }
    requestAnimationFrame(animate);

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    // Pause the animation loop while the tab is hidden to save battery/CPU.
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) lastFrame = 0;
    });
  }
})();

(function () {
  "use strict";

  let cleanup = null;

  function initializeImmersiveHome() {
    if (document.body.dataset.page !== "home") return;
    cleanup?.();

    const header = document.querySelector("#site-header");
    const hero = document.querySelector("[data-hero]");
    const steps = [...document.querySelectorAll("[data-showcase-step]")];
    const visuals = [...document.querySelectorAll("[data-showcase-visual]")];
    const counter = document.querySelector("#showcase-current");
    const revealItems = [...document.querySelectorAll("[data-reveal]")];
    const cleanups = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.body.classList.add("immersive-ready");

    function setActive(index) {
      steps.forEach((step) => step.classList.toggle("active", Number(step.dataset.showcaseStep) === index));
      visuals.forEach((visual) => {
        const active = Number(visual.dataset.showcaseVisual) === index;
        visual.classList.toggle("active", active);
        visual.setAttribute("aria-hidden", String(!active));
      });
      if (counter) counter.textContent = String(index + 1).padStart(2, "0");
    }

    setActive(0);

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
      revealItems.forEach((item) => revealObserver.observe(item));
      cleanups.push(() => revealObserver.disconnect());
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    steps.forEach((step) => {
      const onFocus = () => setActive(Number(step.dataset.showcaseStep));
      step.addEventListener("focusin", onFocus);
      cleanups.push(() => step.removeEventListener("focusin", onFocus));
    });

    let animationFrame = 0;
    const updateActiveStep = () => {
      const viewportCenter = window.innerHeight * 0.5;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      steps.forEach((step) => {
        const rect = step.getBoundingClientRect();
        const distance = rect.top <= viewportCenter && rect.bottom >= viewportCenter
          ? 0
          : Math.min(Math.abs(rect.top - viewportCenter), Math.abs(rect.bottom - viewportCenter));
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = Number(step.dataset.showcaseStep);
        }
      });
      setActive(closestIndex);
    };
    const updateScrollState = () => {
      animationFrame = 0;
      const scrollY = window.scrollY;
      header?.classList.toggle("is-scrolled", scrollY > 36);
      updateActiveStep();
      if (hero && !reducedMotion) {
        const shift = Math.min(scrollY * 0.12, 110);
        hero.style.setProperty("--hero-shift", `${shift}px`);
      }
    };
    const onScroll = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateScrollState);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    });
    updateScrollState();

    cleanup = () => cleanups.forEach((dispose) => dispose());
  }

  document.addEventListener("baan:home-rendered", initializeImmersiveHome);
  initializeImmersiveHome();
})();

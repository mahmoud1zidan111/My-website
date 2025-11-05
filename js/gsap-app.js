document.addEventListener("DOMContentLoaded", () => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
  ScrollTrigger.defaults({ toggleActions: "play none none reverse" });

  // منع عناصر الهيرو من اعتراض الكليك
  gsap.set(".landing .intro-text, .shar-bottom", { pointerEvents: "none" });

  // 1) Scroll progress bar
  gsap.to(".scroll-progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { scrub: 0.3 },
  });

  // 2) Header intro
  gsap.from(".header .container", { y: -24, autoAlpha: 0, duration: 0.6 });

  // 3) Hero split intro (استثناء عناصر الهيرو من أي batch)
  const hero = document.querySelector("[data-hero]");
  if (hero) {
    splitWords(hero);
    gsap.set(".split .char", { yPercent: 120, rotateZ: 0.001 });

    const landingFades = document.querySelectorAll(
      ".landing [data-anim='fade']"
    );
    const tl = gsap.timeline();
    tl.to(
      ".split .char",
      { yPercent: 0, stagger: 0.03, duration: 0.9 },
      0.1
    ).to(
      landingFades,
      { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.8, overwrite: "auto" },
      0.2
    );
  }

  // 4) Section reveal (استثناء عناصر الهيرو)
  const fadeEls = Array.from(
    document.querySelectorAll('[data-anim="fade"]')
  ).filter((el) => !el.closest(".landing"));
  if (fadeEls.length) {
    ScrollTrigger.batch(fadeEls, {
      start: "top 85%",
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.8,
          overwrite: "auto",
        }),
      onLeaveBack: (batch) =>
        gsap.to(batch, {
          autoAlpha: 0,
          y: 24,
          stagger: 0.05,
          duration: 0.5,
          overwrite: "auto",
        }),
    });
  }

  // 5) Cards reveal
  const cards = document.querySelectorAll('[data-anim="card"]');
  if (cards.length) {
    ScrollTrigger.batch(cards, {
      start: "top 85%",
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.8,
          overwrite: "auto",
        }),
      onLeaveBack: (batch) =>
        gsap.to(batch, {
          autoAlpha: 0,
          y: 24,
          scale: 0.96,
          stagger: 0.05,
          duration: 0.5,
          overwrite: "auto",
        }),
    });

    // خلي الكارت كله يفتح اللينك لو المستخدم دس في أي مكان
    cards.forEach((card) => {
      const link = card.querySelector("a[href]");
      if (!link) return;
      card.addEventListener("click", (e) => {
        // لو الضغط كان على <a> جوه الكارت سيبه يشتغل عادي
        if (e.target.closest("a")) return;
        window.open(link.href, "_blank"); // أو "_self" لو عايز نفس التبويب
      });
    });
  }

  // 6) Image mask reveal
  document.querySelectorAll('[data-anim="img"]').forEach((img) => {
    gsap.to(img, {
      clipPath: "inset(0% 0% 0% 0% round 12px)",
      autoAlpha: 1,
      scrollTrigger: {
        trigger: img,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // 7) Parallax
  document.querySelectorAll("[data-speed]").forEach((el) => {
    const s = parseFloat(el.dataset.speed || 0.2);
    gsap.to(el, {
      yPercent: -s * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // 8) Tilt + Magnetic
  document.querySelectorAll(".tilt").forEach((el) => tiltHover(el));
  document.querySelectorAll(".magnetic").forEach((el) => magnetic(el));

  // 9) Skills
  document.querySelectorAll(".skill").forEach((skill) => {
    const bar = skill.querySelector(".progress");
    const pct = skill.querySelector(".percentage");
    if (!bar || !pct) return;
    const value = Math.min(100, parseInt(bar.dataset.value || "0", 10));

    ScrollTrigger.create({
      trigger: skill,
      start: "top 80%",
      onEnter: () => {
        gsap.to(bar, { width: value + "%", duration: 1.2, overwrite: "auto" });
        const obj = { val: 0 };
        gsap.to(obj, {
          val: value,
          duration: 1.2,
          onUpdate() {
            pct.textContent = Math.round(obj.val) + "%";
          },
        });
      },
      onLeaveBack: () => {
        gsap.set(bar, { width: "0%" });
        pct.textContent = "0%";
      },
    });
  });

  // 10) Back-to-top
  const backTop = document.getElementById("btn");
  if (backTop) {
    ScrollTrigger.create({
      start: 500,
      onEnter: () => backTop.classList.add("is-visible"),
      onLeaveBack: () => backTop.classList.remove("is-visible"),
    });
    backTop.addEventListener("click", () =>
      gsap.to(window, { duration: 0.8, scrollTo: 0, ease: "power2.out" })
    );
  }

  // 11) Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target =
        id && id !== "#" ? document.querySelector(id) : document.body;
      if (target) {
        e.preventDefault();
        gsap.to(window, {
          duration: 0.9,
          scrollTo: target,
          ease: "power3.out",
          offsetY: 12,
        });
      }
    });
  });

  /* Helpers */
  function splitWords(el) {
    const text = el.textContent.trim();
    el.innerHTML = text
      .split(/\s+/)
      .map(
        (w) => `<span class="word"><span class="char">${w}</span>&nbsp;</span>`
      )
      .join("");
  }
  function magnetic(el) {
    const strength = parseFloat(el.dataset.magnet || 25);
    const qx = gsap.quickTo(el, "x", { duration: 0.3, ease: "power3" });
    const qy = gsap.quickTo(el, "y", { duration: 0.3, ease: "power3" });
    el.style.willChange = "transform";
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      qx((mx / r.width) * strength);
      qy((my / r.height) * strength);
    });
    el.addEventListener("mouseleave", () => {
      qx(0);
      qy(0);
    });
  }
  function tiltHover(card) {
    const qrx = gsap.quickTo(card, "rotateX", {
      duration: 0.3,
      ease: "power3",
    });
    const qry = gsap.quickTo(card, "rotateY", {
      duration: 0.3,
      ease: "power3",
    });
    const qz = gsap.quickTo(card, "z", { duration: 0.3, ease: "power3" });
    card.addEventListener("mousemove", (e) => {
      const b = card.getBoundingClientRect();
      const px = (e.clientX - b.left) / b.width - 0.5;
      const py = (e.clientY - b.top) / b.height - 0.5;
      qry(px * 12);
      qrx(-py * 12);
      qz(30);
    });
    card.addEventListener("mouseleave", () => {
      qrx(0);
      qry(0);
      qz(0);
      gsap.to(card, { duration: 0.5, ease: "power2.out" });
    });
  }
});

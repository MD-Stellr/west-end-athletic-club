/* =====================================================================
   WEST END ATHLETIC CLUB — main.js
   Loader, smooth scroll (Lenis), GSAP scroll animations
   ===================================================================== */

(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  const counterEl = document.getElementById('counter');
  const loaderBrand = document.querySelector('.loader__brand');
  const loaderFill = document.querySelector('.loader__progress-fill');

  const qs = new URLSearchParams(location.search);
  const screenshotMode = qs.has('screenshot');
  const skipLoader = qs.has('skip-loader') || qs.has('no-animate') || screenshotMode;
  const noAnimate  = qs.has('no-animate') || screenshotMode;
  if (!skipLoader) document.body.classList.add('is-loading');
  if (screenshotMode) document.documentElement.classList.add('screenshot-mode');

  const runLoader = () => {
    let current = 0;
    const target = 100;
    const duration = 1700; // ms
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.floor(eased * target);
      counterEl.textContent = current.toString().padStart(2, '0');
      if (loaderFill) loaderFill.style.width = (eased * 100) + '%';

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counterEl.textContent = '100';
        // brand reveal
        if (loaderBrand) {
          loaderBrand.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          loaderBrand.style.opacity = '1';
          loaderBrand.style.transform = 'translateX(-50%) translateY(0)';
        }
        setTimeout(dismissLoader, 700);
      }
    };

    requestAnimationFrame(tick);
  };

  const dismissLoader = () => {
    loader.classList.add('is-leaving');
    document.body.classList.remove('is-loading');
    setTimeout(() => {
      if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
      kickoffPageAnimations();
    }, 1100);
  };

  // start loader after fonts ready (or after timeout fallback)
  const startLoader = () => requestAnimationFrame(() => runLoader());
  if (skipLoader) {
    if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    document.body.classList.remove('is-loading');
    requestAnimationFrame(kickoffPageAnimations);
  } else if (document.fonts && document.fonts.ready) {
    Promise.race([
      document.fonts.ready,
      new Promise(r => setTimeout(r, 1500))
    ]).then(startLoader);
  } else {
    startLoader();
  }

  /* ---------- SMOOTH SCROLL (Lenis) ---------- */
  let lenis;
  const initLenis = () => {
    if (prefersReducedMotion || typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  };

  /* ---------- NAV ---------- */
  const nav = document.getElementById('nav');
  const onScrollNav = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  // Mobile menu
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- SPLIT TEXT INTO WORD-LINES ---------- */
  // Wrap each word in a .word > span structure for line-mask reveal.
  // Keeps <em>…</em> intact and attaches trailing punctuation to the
  // previous token so "discipline." doesn't become "discipline .".
  const splitHeadline = (el) => {
    const html = el.innerHTML;
    let tokens = html.split(/(<em\b[^>]*>.*?<\/em>|\s+)/i).filter(t => t && !/^\s+$/.test(t));
    // merge pure-punctuation tokens into the previous one
    const merged = [];
    for (const t of tokens) {
      if (merged.length && /^[.,;:!?'")\]…—-]+$/.test(t)) {
        merged[merged.length - 1] += t;
      } else {
        merged.push(t);
      }
    }
    el.innerHTML = merged
      .map(t => /^<br\s*\/?>$/i.test(t) ? '<br>' : `<span class="word"><span>${t}</span></span>`)
      .join(' ');
  };

  /* ---------- KICK OFF GSAP ANIMATIONS ---------- */
  function kickoffPageAnimations() {
    if (noAnimate) {
      // Debug / screenshot mode: split headlines for layout but skip all animations
      document.querySelectorAll('.hero__headline, [data-split], .footer__mega').forEach(splitHeadline);
      return;
    }

    initLenis();

    if (typeof gsap === 'undefined') {
      // fallback: simple IntersectionObserver reveal
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-in'); });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach(el => io.observe(el));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* HERO — split & reveal */
    const heroHeadline = document.querySelector('.hero__headline');
    if (heroHeadline) {
      splitHeadline(heroHeadline);
      gsap.from('.hero__headline .word span', {
        yPercent: 110,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.05,
        delay: 0.15
      });
    }

    gsap.from('.hero__topbar .meta', { y: -16, opacity: 0, duration: 0.8, ease: 'expo.out', delay: 0.2 });
    gsap.from('.hero__sub', { y: 20, opacity: 0, duration: 1, ease: 'expo.out', delay: 0.9 });
    gsap.from('.hero__actions > *', { y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.1, delay: 1.05 });
    gsap.from('.hero__caption', { y: 20, opacity: 0, duration: 1, ease: 'expo.out', delay: 1.2 });
    gsap.from('.hero__scroll', { opacity: 0, duration: 1, ease: 'expo.out', delay: 1.4 });

    /* Hero image parallax */
    if (!prefersReducedMotion) {
      gsap.to('.hero__media img', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    /* Generic reveal */
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el, {
        y: 28,
        opacity: 0,
        duration: 0.95,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    /* Mission quote — simple fade-up reveal */
    gsap.utils.toArray('.mission__quote').forEach(el => {
      gsap.from(el, {
        y: 30, opacity: 0, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 82%' }
      });
    });

    /* Headline line-mask reveals on scroll */
    gsap.utils.toArray('[data-split]').forEach(el => {
      splitHeadline(el);
      const words = el.querySelectorAll('.word span');
      gsap.from(words, {
        yPercent: 110,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.04,
        scrollTrigger: { trigger: el, start: 'top 82%' }
      });
    });

    /* Counter animations on stats */
    gsap.utils.toArray('.count').forEach(el => {
      const finalText = el.dataset.count || el.textContent;
      const suffix = el.dataset.suffix || '';
      const num = parseFloat(finalText.replace(/[^\d.]/g, ''));
      if (isNaN(num)) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: num,
        duration: 1.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        onUpdate: () => {
          const v = obj.val;
          // format with commas if appropriate
          const display = num >= 1000 ? Math.floor(v).toLocaleString('en-US') : Math.floor(v);
          el.textContent = display + suffix;
        }
      });
    });

    /* Facility hero parallax */
    if (!prefersReducedMotion) {
      gsap.to('.facility__hero img', {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: '.facility__hero',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    /* Facility grid stagger */
    gsap.utils.toArray('.facility__grid figure').forEach((fig, i) => {
      gsap.from(fig, {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        delay: (i % 6) * 0.04,
        scrollTrigger: { trigger: fig, start: 'top 92%' }
      });
    });

    /* Youth media parallax */
    if (!prefersReducedMotion) {
      gsap.to('.youth__media img', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.youth__media',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    /* Value rows — slide in */
    gsap.utils.toArray('.value').forEach((row, i) => {
      gsap.from(row, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        delay: i * 0.05,
        scrollTrigger: { trigger: row, start: 'top 85%' }
      });
    });

    /* Track rows */
    gsap.utils.toArray('.track').forEach((row, i) => {
      gsap.from(row, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
        delay: i * 0.05,
        scrollTrigger: { trigger: row, start: 'top 88%' }
      });
    });

    /* Footer mega text — split */
    const footerMega = document.querySelector('.footer__mega');
    if (footerMega) {
      splitHeadline(footerMega);
      gsap.from('.footer__mega .word span', {
        yPercent: 110,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.04,
        scrollTrigger: { trigger: footerMega, start: 'top 80%' }
      });
    }

    /* Refresh ScrollTrigger after images load */
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ---------- INSTANT FALLBACK if scripts disabled ---------- */
  // For users without JS, content is still visible — nothing to do here
  // The `.reveal` class is inert without JS via the CSS transition.

  /* ---------- SMOOTH ANCHOR LINKS ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -60, duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

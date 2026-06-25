/* =====================================================================
   WEST END ATHLETIC CLUB — main.js
   Loader, smooth scroll (Lenis), GSAP scroll animations
   ===================================================================== */

(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- META PIXEL (site-wide) ----------
     Loaded here so every page that includes main.js gets the base pixel +
     PageView — and so the lead-capture popup (which appears on every page
     except /promo) can fire its `Lead` event. NOTE: do not also paste the
     inline pixel into any page <head> or PageView will fire twice. */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', '2077569749638468');
  window.fbq('track', 'PageView');

  /* ---------- SHARED LEAD-CAPTURE HELPERS ----------
     Used by both the promo-page form (initPromoForm) and the site-wide
     popup (initPromoModal) so they post identical field names to the same
     GHL webhook — no GHL changes needed to capture popup leads. */
  const GHL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/yifLVeto5irb0ZwcVepP/webhook-trigger/23a5597a-159f-45a6-bbb7-0abff312a7ed';
  const ATTR_KEYS = ['gclid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const setFormHidden = (form, name, value) => {
    let el = form.querySelector('input[name="' + name + '"]');
    if (!el) { el = document.createElement('input'); el.type = 'hidden'; el.name = name; form.appendChild(el); }
    el.value = value || '';
  };
  // Persist click IDs + UTMs for the session so they survive page hops to the popup.
  (function captureAttribution() {
    const params = new URLSearchParams(location.search);
    ATTR_KEYS.forEach(k => { const v = params.get(k); if (v) { try { sessionStorage.setItem('attr_' + k, v); } catch (_) {} } });
  })();

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  const counterEl = document.getElementById('counter');
  const loaderBrand = document.querySelector('.loader__brand');
  const loaderFill = document.querySelector('.loader__progress-fill');

  const qs = new URLSearchParams(location.search);
  const screenshotMode = qs.has('screenshot');
  const skipLoader = !loader || qs.has('skip-loader') || qs.has('no-animate') || screenshotMode;
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
      gsap.to('.hero__media img, .hero__video', {
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

  /* ---------- LIGHTBOX (facility gallery) ---------- */
  (function initLightbox() {
    const imgs = Array.from(document.querySelectorAll('.facility__grid img'));
    if (!imgs.length) return;

    const srcs = imgs.map(img => img.currentSrc || img.src);
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('aria-hidden', 'true');
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML =
      '<span class="lightbox__count"></span>' +
      '<button class="lightbox__close" aria-label="Close (Esc)">&times;</button>' +
      '<button class="lightbox__nav lightbox__prev" aria-label="Previous">&#8249;</button>' +
      '<img class="lightbox__img" alt="">' +
      '<button class="lightbox__nav lightbox__next" aria-label="Next">&#8250;</button>';
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('.lightbox__img');
    const lbCount = lb.querySelector('.lightbox__count');
    let idx = 0;

    const render = () => {
      lbImg.src = srcs[idx];
      lbCount.textContent = (idx + 1) + ' / ' + srcs.length;
    };
    const open = i => {
      idx = i;
      render();
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    };
    const close = () => {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    };
    const step = d => { idx = (idx + d + srcs.length) % srcs.length; render(); };

    imgs.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => open(i));
    });
    lb.addEventListener('click', e => {
      if (e.target === lb || e.target.classList.contains('lightbox__close')) close();
    });
    lb.querySelector('.lightbox__prev').addEventListener('click', e => { e.stopPropagation(); step(-1); });
    lb.querySelector('.lightbox__next').addEventListener('click', e => { e.stopPropagation(); step(1); });
    window.addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
  })();

  /* ---------- PROMO MODAL ("3 Days Free" lead capture) ---------- */
  (function initPromoModal() {
    // Don't show on the promo page itself, or if already seen this session.
    if (/\/promo(\.html)?$/i.test(location.pathname)) return;
    if (sessionStorage.getItem('wec_promo_seen')) return;

    const page = location.pathname.split('/').pop() || 'index.html';
    const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';

    const m = document.createElement('div');
    m.className = 'promo-modal';
    m.id = 'promoModal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-labelledby', 'promoModalTitle');
    m.setAttribute('aria-hidden', 'true');
    m.innerHTML =
      '<div class="promo-modal__card">' +
        '<button class="promo-modal__close" type="button" aria-label="Close">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
        '<div class="promo-modal__media" aria-hidden="true">' +
          '<img src="images/f5.jpg" alt="">' +
          '<span class="promo-modal__media-tag">West End<span>Est. 2015 · Etobicoke</span></span>' +
        '</div>' +
        '<div class="promo-modal__body">' +
          '<span class="promo-modal__eyebrow">New members · Limited</span>' +
          '<h2 class="promo-modal__title" id="promoModalTitle">3 Days <span>Free.</span></h2>' +
          '<p class="promo-modal__sub">Every class, the bag room, open gym — on us. No card on file, no catch. Just show up and train.</p>' +
          '<form class="promo-form" novalidate>' +
            '<label>First name<input type="text" name="first_name" autocomplete="given-name" placeholder="Your name" required></label>' +
            '<label>Email<input type="email" name="email" autocomplete="email" placeholder="you@email.com" required></label>' +
            '<label>Phone<input type="tel" name="phone" autocomplete="tel" placeholder="(416) 000-0000" required></label>' +
            '<label>Do you have boxing experience?<select name="boxing_experience" required>' +
              '<option value="" disabled selected>Select one…</option>' +
              '<option value="none">Complete beginner — never boxed</option>' +
              '<option value="some">Some experience</option>' +
              '<option value="experienced">Experienced — I\'ve trained or competed</option>' +
            '</select></label>' +
            '<label>Do you have your own gear?<select name="has_equipment" required>' +
              '<option value="" disabled selected>Select one…</option>' +
              '<option value="yes">Yes — I have gloves &amp; wraps</option>' +
              '<option value="no">No — please set me up with gear</option>' +
            '</select></label>' +
            '<input type="hidden" name="last_name" value="">' +
            '<input type="hidden" name="source" value="3 Days Free Popup">' +
            '<input type="hidden" name="page" value="' + page + '">' +
            '<button class="btn-primary" type="submit">Claim My 3 Days' + arrow + '</button>' +
            '<p class="promo-form__fine">No commitment. We’ll text you to lock in your first session.</p>' +
          '</form>' +
          '<div class="promo-modal__success" hidden>' +
            '<span class="promo-modal__success-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg></span>' +
            '<h3>You’re in.</h3>' +
            '<p>We’ll reach out shortly to book your first session. See you in the gym.</p>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(m);

    const card = m.querySelector('.promo-modal__card');
    const closeBtn = m.querySelector('.promo-modal__close');
    const form = m.querySelector('.promo-form');
    const success = m.querySelector('.promo-modal__success');
    let shown = false;
    let lastFocus = null;

    const open = () => {
      if (shown) return;
      shown = true;
      sessionStorage.setItem('wec_promo_seen', '1');
      lastFocus = document.activeElement;
      m.classList.add('is-open');
      m.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
      setTimeout(() => { const f = m.querySelector('input'); if (f) f.focus(); }, 360);
    };
    const close = () => {
      m.classList.remove('is-open');
      m.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    closeBtn.addEventListener('click', close);
    m.addEventListener('click', e => { if (e.target === m) close(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && m.classList.contains('is-open')) close();
    });
    // Simple focus trap
    m.addEventListener('keydown', e => {
      if (e.key !== 'Tab' || !m.classList.contains('is-open')) return;
      const f = Array.from(m.querySelectorAll('button, input, a[href]'))
        .filter(el => !el.disabled && el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    let submitting = false;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (submitting) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      submitting = true;
      // Same field names + same webhook as the promo-page form, so GHL needs
      // no changes — popup leads land via the existing mapping (source tells
      // them apart). Attribution is pulled from the session captured on load.
      ATTR_KEYS.forEach(k => { let v = ''; try { v = sessionStorage.getItem('attr_' + k) || ''; } catch (_) {} setFormHidden(form, k, v); });
      setFormHidden(form, 'landing_url', location.href);
      setFormHidden(form, 'referrer', document.referrer || '');
      const body = new URLSearchParams(new FormData(form)).toString();
      // Fire-and-forget (cross-origin webhook → opaque no-cors response).
      fetch(GHL_WEBHOOK, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body
      }).catch(() => {}).finally(() => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'generate_lead', lead_source: '3 Days Free Popup', form_id: 'promoModal' });
        if (typeof window.fbq === 'function') { try { window.fbq('track', 'Lead'); } catch (_) {} }
        form.hidden = true;
        success.hidden = false;
      });
    });

    // Triggers: 10s dwell timer + exit-intent (whichever comes first).
    const timer = setTimeout(open, 10000);
    const onExitIntent = e => { if (e.clientY <= 0) { clearTimeout(timer); open(); } };
    document.addEventListener('mouseleave', onExitIntent);
  })();

  /* ---------- PAGE-HERO BACKGROUND VIDEO (inner pages) ---------- */
  (function initHeroVideo() {
    if (prefersReducedMotion) return; // CSS already hides it; don't fetch the file
    document.querySelectorAll('.page-hero__video, .hero__video').forEach(video => {
      const reveal = () => video.classList.add('is-ready');
      if (video.readyState >= 3) reveal();
      else video.addEventListener('canplay', reveal, { once: true });
      // Nudge autoplay for browsers that defer muted-inline playback
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    });
  })();

  /* ---------- PROMO LEAD FORM (promo.html → GHL webhook) ---------- */
  (function initPromoForm() {
    const form = document.getElementById('promo-form');
    if (!form) return;
    const WEBHOOK = form.getAttribute('action');

    // Persist click IDs + UTMs for the session so they survive page hops.
    const ATTR_KEYS = ['gclid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const params = new URLSearchParams(location.search);
    ATTR_KEYS.forEach(k => { const v = params.get(k); if (v) { try { sessionStorage.setItem('attr_' + k, v); } catch (_) {} } });

    const setHidden = (name, value) => {
      let el = form.querySelector('input[name="' + name + '"]');
      if (!el) { el = document.createElement('input'); el.type = 'hidden'; el.name = name; form.appendChild(el); }
      el.value = value || '';
    };
    ATTR_KEYS.forEach(k => { let v = ''; try { v = sessionStorage.getItem('attr_' + k) || ''; } catch (_) {} setHidden(k, v); });
    setHidden('landing_url', location.href);
    setHidden('referrer', document.referrer || '');

    const btn = form.querySelector('button[type="submit"]');
    let submitting = false;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (submitting) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      submitting = true;
      if (btn) { btn.disabled = true; btn.dataset.label = btn.innerHTML; btn.textContent = 'Sending…'; }

      const body = new URLSearchParams(new FormData(form)).toString();
      // Fire-and-forget: GHL webhook is cross-origin, so the response is
      // opaque (no-cors). We assume success once the request is dispatched.
      fetch(WEBHOOK, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body
      }).catch(() => {}).finally(() => {
        fireConversions();
        showSuccess();
      });
    });

    function fireConversions() {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'generate_lead', lead_source: '3 Days Free Promo', form_id: 'promo-form' });
      if (typeof window.fbq === 'function') { try { window.fbq('track', 'Lead'); } catch (_) {} }
      // Google Ads (only if NOT firing via GTM): set your conversion ID/label.
      // if (typeof window.gtag === 'function') { window.gtag('event', 'conversion', { send_to: 'AW-XXXXXXXXX/XXXXXXXXXXX' }); }
    }

    function showSuccess() {
      form.innerHTML =
        '<div class="lead-form__success">' +
          '<span class="lead-form__success-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg></span>' +
          '<h2 class="lead-form__title">You’re <em>in.</em></h2>' +
          '<p class="lead-form__lead" style="margin-bottom:0;">Your 3-day pass is on its way by text — watch your phone over the next 5 minutes. See you in the gym.</p>' +
        '</div>';
      if (lenis) lenis.scrollTo(form, { offset: -90, duration: 1.0 });
      else form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  })();

  /* ---------- VSL PLAYER (promo.html video sales letter) ---------- */
  (function initVSL() {
    const video = document.getElementById('vslVideo');
    if (!video) return;
    const frame = video.closest('.vsl__frame');
    const cover = document.getElementById('vslCover');
    const replay = document.getElementById('vslReplay');

    const play = () => {
      frame.classList.remove('is-ended');
      frame.classList.add('is-playing');
      video.controls = true;
      video.muted = false;
      try { video.currentTime = 0; } catch (_) {}
      const p = video.play();
      // If sound-on autoplay is blocked, fall back to muted playback.
      if (p && p.catch) {
        p.catch(() => { video.muted = true; video.play().catch(() => {}); });
      }
    };

    cover.addEventListener('click', play);
    if (replay) replay.addEventListener('click', play);

    video.addEventListener('ended', () => {
      video.controls = false;
      frame.classList.remove('is-playing');
      frame.classList.add('is-ended');
    });
  })();
})();

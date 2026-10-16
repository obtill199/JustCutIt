(() => {
  // Jimmy's contact info (keep in sync with index.html)
  const PHONE = '3165599535';
  const EMAIL = 'justcutitlandscaping@icloud.com';

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  if ('IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('reveal-ready');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('[data-reveal]').forEach((el) => io.observe(el));
  }

  /* ---------- Header + mobile contact bar ---------- */
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const mobileBar = $('[data-mobile-bar]');
  const heroActions = $('.hero-actions');
  if (mobileBar && heroActions && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      mobileBar.classList.toggle('is-visible', !entry.isIntersecting);
    }).observe(heroActions);
  }

  /* ---------- Mobile menu ---------- */
  const toggle = $('.menu-toggle');
  const nav = $('#site-nav');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  matchMedia('(min-width: 1001px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Hero yard: the mower cuts one stripe at a time ---------- */
  const yard = $('[data-yard]');
  if (yard && !reduceMotion) {
    const stripes = $$('.stripe', yard);
    const mower = $('.mower', yard);
    const N = stripes.length;
    const PER_STRIPE = 2400; // ms to mow one stripe
    const HOLD = 2200;       // ms to admire the finished lawn
    const REGROW = 700;      // ms for the grass to "grow back" before the next loop
    const CYCLE = N * PER_STRIPE + HOLD + REGROW;
    const clamp = (v) => Math.max(0, Math.min(1, v));

    let start = null;
    let running = false;
    let frame = 0;

    const render = (t) => {
      if (start === null) start = t;
      const e = (t - start) % CYCLE;
      const H = yard.clientHeight;
      const sw = yard.clientWidth / N;
      const mw = mower.clientWidth;
      const mh = mower.clientHeight;

      if (e < N * PER_STRIPE) {
        const i = Math.floor(e / PER_STRIPE);
        const p = (e - i * PER_STRIPE) / PER_STRIPE;
        const down = i % 2 === 0;
        const travel = H + mh;
        const y = down ? -mh + p * travel : H - p * travel;
        // cut grass trails the middle of the mower
        const cutLen = down ? y + mh * 0.5 : H - (y + mh * 0.5);

        stripes.forEach((s, j) => {
          s.style.setProperty('--cut', j < i ? 1 : j === i ? clamp(cutLen / H) : 0);
          s.firstElementChild.style.opacity = 1;
        });
        const x = i * sw + (sw - mw) / 2;
        mower.style.transform = `translate(${x}px, ${y}px) rotate(${down ? 0 : 180}deg)`;
        yard.classList.add('is-animating');
      } else {
        // finished: hold, then fade the stripes out so the loop restarts cleanly
        yard.classList.remove('is-animating');
        const r = clamp((e - N * PER_STRIPE - HOLD) / REGROW);
        stripes.forEach((s) => {
          s.style.setProperty('--cut', 1);
          s.firstElementChild.style.opacity = 1 - r;
        });
      }
      frame = requestAnimationFrame(render);
    };

    const play = () => { if (!running) { running = true; frame = requestAnimationFrame(render); } };
    const pause = () => { running = false; cancelAnimationFrame(frame); };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause())).observe(yard);
    } else {
      play();
    }
  }

  /* ---------- Quote form: builds a text message to Jimmy ---------- */
  const form = $('[data-quote-form]');
  if (form) {
    const error = $('[data-form-error]', form);
    const fallback = $('[data-form-fallback]', form);
    const messageBox = $('[data-form-message]', form);
    const copyBtn = $('[data-copy]', form);
    const emailLink = $('[data-email]', form);
    const frequency = $('[data-frequency]', form);

    // Frequency only applies to mowing
    const syncFrequency = () => {
      frequency.hidden = form.elements.service.value !== 'Mowing';
    };
    form.addEventListener('change', (e) => { if (e.target.name === 'service') syncFrequency(); });
    syncFrequency();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.elements.name;
      const address = form.elements.address;
      const missing = [name, address].filter((f) => !f.value.trim());
      [name, address].forEach((f) => f.setAttribute('aria-invalid', String(missing.includes(f))));
      error.hidden = missing.length === 0;
      if (missing.length) {
        missing[0].focus();
        return;
      }

      const service = form.elements.service.value;
      const lines = [
        `Hi Jimmy! I'd like a quote from Just Cut It.`,
        `Name: ${name.value.trim()}`,
        `Address: ${address.value.trim()}`,
        `Service: ${service}`,
      ];
      if (service === 'Mowing') lines.push(`How often: ${form.elements.frequency.value}`);
      const notes = form.elements.notes.value.trim();
      if (notes) lines.push(`Notes: ${notes}`);
      const message = lines.join('\n');

      messageBox.textContent = message;
      emailLink.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Quote request')}&body=${encodeURIComponent(message)}`;
      fallback.hidden = false;
      // "?&body=" works on both iOS and Android
      window.location.href = `sms:+1${PHONE}?&body=${encodeURIComponent(message)}`;
    });

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(messageBox.textContent);
        copyBtn.textContent = 'Copied!';
      } catch (_) {
        const range = document.createRange();
        range.selectNodeContents(messageBox);
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        copyBtn.textContent = 'Selected, press copy';
      }
      setTimeout(() => { copyBtn.textContent = 'Copy message'; }, 2200);
    });
  }

  /* ---------- Footer year ---------- */
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();

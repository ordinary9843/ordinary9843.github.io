/* ============================================================
   Particle Canvas — aquamarine dots with connection lines
============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const mouse = { x: -9999, y: -9999 };
  const COLOR = '0, 255, 178';
  const COUNT = 55, SPEED = 0.35, LINK = 115;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    const a = Math.random() * Math.PI * 2;
    const s = (Math.random() * 0.5 + 0.2) * SPEED;
    return { x: Math.random() * w, y: Math.random() * h, vx: Math.cos(a) * s, vy: Math.sin(a) * s };
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, 0.65)`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${COLOR}, ${(1 - d / LINK) * 0.22})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
      const md  = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 140) {
        const f = (140 - md) / 140 * 0.9;
        p.vx += (mdx / md) * f * 0.3;
        p.vy += (mdy / md) * f * 0.3;
        const mv = SPEED * 3.5;
        const v  = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (v > mv) { p.vx = (p.vx / v) * mv; p.vy = (p.vy / v) * mv; }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  particles = Array.from({ length: COUNT }, mkParticle);
  draw();

  window.addEventListener('resize', () => {
    resize();
    particles = Array.from({ length: COUNT }, mkParticle);
  });

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
})();

/* ============================================================
   Typing Animation
============================================================ */
(function initTyper() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const words = ['Backend Engineer', 'NestJS Developer', 'Cloud Architect', 'System Designer'];
  let wi = 0, ci = 0, del = false;

  function tick() {
    const w = words[wi];
    el.textContent = del ? w.slice(0, --ci) : w.slice(0, ++ci);
    let delay = del ? 32 : 82;
    if (!del && ci === w.length) { delay = 1900; del = true; }
    else if (del && ci === 0)    { del = false; wi = (wi + 1) % words.length; delay = 380; }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 900);
})();

/* ============================================================
   Scroll Reveal — staggered Intersection Observer
============================================================ */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const siblings = [...(e.target.parentElement?.querySelectorAll('.reveal:not(.visible)') ?? [])];
      const idx = siblings.indexOf(e.target);
      setTimeout(() => e.target.classList.add('visible'), Math.min(idx * 75, 220));
      io.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
})();

/* ============================================================
   Counter Animation
============================================================ */
(function initCounters() {
  const els = document.querySelectorAll('[data-target]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.done) return;
      e.target.dataset.done = '1';
      io.unobserve(e.target);
      const target = +e.target.dataset.target;
      const suffix = e.target.dataset.suffix ?? '';
      const dur = 1500, start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        e.target.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });

  els.forEach(el => io.observe(el));
})();

/* ============================================================
   Navbar + Back-to-top
============================================================ */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('nav-burger');
  const links  = document.getElementById('nav-links');
  const btt    = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
    btt?.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  burger?.addEventListener('click', () => {
    const open = links?.classList.toggle('open');
    burger.classList.toggle('active', !!open);
  });

  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger?.classList.remove('active');
    });
  });

  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ============================================================
   Section Title Scramble
============================================================ */
(function initScramble() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&';

  function scramble(el) {
    const final = el.dataset.text || el.textContent;
    const len = final.length;
    let frame = 0;
    const total = 42;

    function tick() {
      el.textContent = [...final].map((ch, i) => {
        if (ch === ' ') return ' ';
        const reveal = (frame / total) - (i / (len * 1.6));
        if (reveal >= 1) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      frame++;
      if (frame <= total + len) requestAnimationFrame(tick);
      else el.textContent = final;
    }
    tick();
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      scramble(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stt').forEach(el => io.observe(el));
})();

/* ============================================================
   Scroll Progress Bar
============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  function update() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total * 100) : 0) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
})();

/* ============================================================
   Custom Cursor
============================================================ */
(function initCursor() {
  const cur = document.getElementById('cursor');
  if (!cur || window.matchMedia('(pointer: coarse)').matches) return;

  document.addEventListener('mousemove', e => {
    cur.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
  document.addEventListener('mouseleave', () => { cur.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cur.style.opacity = '1'; });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('is-hover', 'is-link'));
    el.addEventListener('mouseleave', () => cur.classList.remove('is-hover', 'is-link'));
  });
  document.querySelectorAll('.sk-item, .stat-cell, .sk-group').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cur.classList.remove('is-hover'));
  });
})();

/* ============================================================
   Active Navigation Highlight
============================================================ */
(function initActiveNav() {
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!links.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (link) link.classList.toggle('active', e.isIntersecting);
    });
  }, { rootMargin: '-10% 0px -80% 0px' });
  document.querySelectorAll('section[id]').forEach(s => io.observe(s));
})();

/* ============================================================
   Skills Command Typing Animation
============================================================ */
(function initSkillsTyping() {
  const groups = document.querySelectorAll('.sk-group');
  if (!groups.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const cmd = e.target.querySelector('.sk-ls');
      const items = e.target.querySelector('.sk-items');
      if (!cmd) { io.unobserve(e.target); return; }
      const final = cmd.textContent;
      cmd.textContent = '';
      if (items) { items.style.opacity = '0'; items.style.transition = 'opacity 0.35s'; }
      let i = 0;
      const t = setInterval(() => {
        cmd.textContent = final.slice(0, ++i);
        if (i >= final.length) {
          clearInterval(t);
          if (items) setTimeout(() => { items.style.opacity = '1'; }, 80);
        }
      }, 46);
      io.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  groups.forEach(g => io.observe(g));
})();

/* ============================================================
   Stat Fill Bars
============================================================ */
(function initStatBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.filled) return;
      e.target.dataset.filled = '1';
      e.target.style.width = (e.target.dataset.width || 0) + '%';
      io.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-fill').forEach(el => io.observe(el));
})();

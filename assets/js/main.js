/* ============================================================
   ELITE SARDINIA HOMES — main.js
   Handles: navbar scroll, mobile menu, scroll animations,
            contact form, footer year, hero bg load
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Navbar scroll effect ---------- */
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ---------- Mobile menu ---------- */
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Hero background parallax-load ---------- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    const bgUrl = heroBg.style.backgroundImage
      .replace(/url\(['"]?/, '')
      .replace(/['"]?\)$/, '');
    const img = new Image();
    img.onload = function () { heroBg.classList.add('loaded'); };
    img.src = bgUrl;
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: show all immediately
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form select: populate from data.js ---------- */
  const propertySelect = document.getElementById('f-property');
  if (propertySelect && typeof PROPERTIES !== 'undefined') {
    // Add generic option first
    const genericOpt = document.createElement('option');
    genericOpt.value = '';
    genericOpt.textContent = 'Informazioni generali';
    propertySelect.appendChild(genericOpt);

    PROPERTIES.forEach(function (p) {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name + ' — ' + p.subtitle;
      propertySelect.appendChild(opt);
    });
  }

  /* ---------- Contact form: pre-fill from modal CTA ---------- */
  // property.js calls this when "Enquire" is clicked from a property modal
  window.prefillContactForm = function (propertyId) {
    const select = document.getElementById('f-property');
    if (select) {
      select.value = propertyId;
    }
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(function () {
      const nameInput = document.getElementById('f-name');
      if (nameInput) nameInput.focus();
    }, 600);
  };

  /* ---------- Contact form: mailto submit ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name     = form.querySelector('[name="name"]').value.trim();
      const email    = form.querySelector('[name="email"]').value.trim();
      const phone    = form.querySelector('[name="phone"]').value.trim();
      const property = form.querySelector('[name="property"]').value;
      const message  = form.querySelector('[name="message"]').value.trim();

      if (!name || !email) {
        alert('Per favore compila nome e indirizzo email.');
        return;
      }

      // Find property name for subject line
      let subject = 'Richiesta informazioni — Elite Sardinia Homes';
      if (property && typeof PROPERTIES !== 'undefined') {
        const prop = PROPERTIES.find(function (p) { return p.id === property; });
        if (prop && prop.contactSubject) subject = prop.contactSubject;
      }

      const body = [
        'Nome: ' + name,
        'Email: ' + email,
        phone ? 'Telefono: ' + phone : '',
        property ? 'Immobile: ' + property : '',
        '',
        message || '(nessun messaggio aggiuntivo)',
      ].filter(Boolean).join('\n');

      const mailto =
        'mailto:' + SITE_CONFIG.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = mailto;
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- Add reveal classes to key sections ---------- */
  // Applied dynamically so the HTML stays clean
  document.querySelectorAll('.section__header').forEach(function (el) {
    el.classList.add('reveal');
  });
  document.querySelectorAll('.about__grid').forEach(function (el) {
    el.classList.add('reveal');
  });
  document.querySelectorAll('.contact__grid').forEach(function (el) {
    el.classList.add('reveal');
  });
  document.querySelectorAll('.properties__grid').forEach(function (el) {
    el.classList.add('reveal-stagger');
  });

})();

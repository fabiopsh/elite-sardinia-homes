/* ============================================================
   ELITE SARDINIA HOMES — gallery.js
   Handles: fullscreen lightbox with keyboard/touch navigation
   Exposed globally: openLightbox(images, startIndex)
   ============================================================ */

(function () {
  'use strict';

  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const counter     = lightbox ? lightbox.querySelector('.lightbox__counter') : null;
  const prevBtn     = lightbox ? lightbox.querySelector('.lightbox__nav--prev') : null;
  const nextBtn     = lightbox ? lightbox.querySelector('.lightbox__nav--next') : null;
  const closeBtn    = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  const backdrop    = lightbox ? lightbox.querySelector('.lightbox__backdrop') : null;

  let images  = [];
  let current = 0;
  let touchStartX = 0;

  /* ---------- Public API ---------- */
  window.openLightbox = function (imgs, startIndex) {
    if (!lightbox || !imgs || !imgs.length) return;
    images  = imgs;
    current = startIndex || 0;
    show();
  };

  /* ---------- Show/hide ---------- */
  function show() {
    updateImage();
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function hide() {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ---------- Navigation ---------- */
  function goTo(index) {
    current = (index + images.length) % images.length;
    updateImage();
  }

  function updateImage() {
    if (!lightboxImg) return;
    lightboxImg.src = images[current];
    lightboxImg.alt = 'Foto ' + (current + 1) + ' di ' + images.length;
    if (counter) {
      counter.textContent = (current + 1) + ' / ' + images.length;
    }
    // Show/hide nav buttons if only 1 image
    if (prevBtn) prevBtn.style.display = images.length > 1 ? '' : 'none';
    if (nextBtn) nextBtn.style.display = images.length > 1 ? '' : 'none';
  }

  /* ---------- Events ---------- */
  if (prevBtn)   prevBtn.addEventListener('click',   function () { goTo(current - 1); });
  if (nextBtn)   nextBtn.addEventListener('click',   function () { goTo(current + 1); });
  if (closeBtn)  closeBtn.addEventListener('click',  hide);
  if (backdrop)  backdrop.addEventListener('click',  hide);

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (!lightbox || lightbox.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'Escape')     hide();
  });

  // Touch swipe
  if (lightbox) {
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 50) {
        goTo(deltaX < 0 ? current + 1 : current - 1);
      }
    }, { passive: true });
  }

})();

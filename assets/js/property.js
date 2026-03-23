/* ============================================================
   ELITE SARDINIA HOMES — property.js
   Handles: rendering property cards, opening/closing modal,
            modal gallery navigation, tab switching
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Render property cards ---------- */
  function renderCards() {
    var grid = document.getElementById('properties-grid');
    if (!grid || typeof PROPERTIES === 'undefined') return;

    PROPERTIES.forEach(function (p, i) {
      var card = buildCard(p);
      card.style.animationDelay = (i * 0.12) + 's';
      card.classList.add('card-fadein');
      grid.appendChild(card);
    });
  }

  function buildCard(p) {
    const el = document.createElement('article');
    el.className = 'property-card';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Visualizza dettagli: ' + p.name);

    const statusLabel = { available: 'Disponibile', sold: 'Venduto', reserved: 'Riservato' }[p.status] || p.status;
    const coverImg = p.images && p.images.length ? p.images[0] : '';

    el.innerHTML =
      '<div class="property-card__img-wrap">' +
        '<img src="' + coverImg + '" alt="' + p.name + '" class="property-card__img" loading="lazy">' +
        '<span class="property-card__badge property-card__badge--' + p.status + '">' + statusLabel + '</span>' +
      '</div>' +
      '<div class="property-card__body">' +
        '<p class="property-card__location">' + p.location.city + ', ' + p.location.area + '</p>' +
        '<h3 class="property-card__name">' + p.name + '</h3>' +
        '<ul class="property-card__specs">' +
          (p.specs.bedrooms ? '<li class="property-card__spec">' + iconBed() + p.specs.bedrooms + ' camere</li>' : '') +
          (p.specs.bathrooms ? '<li class="property-card__spec">' + iconBath() + p.specs.bathrooms + ' bagni</li>' : '') +
          (p.specs.sqm ? '<li class="property-card__spec">' + iconSqm() + p.specs.sqm + ' m²</li>' : '') +
          (p.specs.pool ? '<li class="property-card__spec">' + iconPool() + 'Piscina</li>' : '') +
        '</ul>' +
        '<div class="property-card__footer">' +
          '<span class="property-card__price">' + p.price.display + '</span>' +
          '<button class="btn btn--gold btn--sm" data-id="' + p.id + '">Scopri di più</button>' +
        '</div>' +
      '</div>';

    // Click on card or button opens modal
    el.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-id]');
      openModal(btn ? btn.dataset.id : p.id);
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(p.id);
      }
    });

    return el;
  }

  /* ---------- Modal state ---------- */
  const modal    = document.getElementById('property-modal');
  const backdrop = modal ? modal.querySelector('.modal__backdrop') : null;
  const panel    = modal ? modal.querySelector('.modal__panel') : null;
  const closeBtn = modal ? modal.querySelector('.modal__close') : null;
  const content  = document.getElementById('modal-content');

  let currentImages = [];
  let currentImgIndex = 0;
  let previousFocus = null;

  function openModal(propertyId) {
    const p = PROPERTIES.find(function (x) { return x.id === propertyId; });
    if (!p || !modal) return;

    previousFocus = document.activeElement;
    renderModal(p);

    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus panel for keyboard trapping
    if (panel) {
      requestAnimationFrame(function () { panel.focus(); });
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  /* ---------- Build modal HTML ---------- */
  function renderModal(p) {
    if (!content) return;

    currentImages = p.images || [];
    currentImgIndex = 0;

    const allImages = p.images || [];
    const archImages = p.architecturalImages || [];
    const docs = p.documents || [];

    content.innerHTML =
      buildGallery(allImages) +
      buildThumbnails(allImages) +
      buildTabs(archImages.length > 0, docs.length > 0) +
      '<div class="modal__body">' +
        buildTabPanel('details', true, buildDetailsContent(p)) +
        buildTabPanel('plans', false, buildPlansContent(archImages)) +
        buildTabPanel('docs', false, buildDocsContent(docs)) +
      '</div>' +
      buildCtaBar(p);

    wireModalGallery();
    wireTabs();
  }

  function buildGallery(images) {
    const first = images[0] || '';
    return (
      '<div class="modal__gallery" id="modal-gallery">' +
        '<img src="' + first + '" alt="Foto principale" class="modal__gallery-img" id="modal-gallery-img">' +
        '<button class="modal__gallery-nav modal__gallery-nav--prev" aria-label="Foto precedente">' + iconPrev() + '</button>' +
        '<button class="modal__gallery-nav modal__gallery-nav--next" aria-label="Foto successiva">' + iconNext() + '</button>' +
      '</div>'
    );
  }

  function buildThumbnails(images) {
    if (images.length < 2) return '';
    const thumbs = images.map(function (src, i) {
      return '<img src="' + src + '" alt="Foto ' + (i + 1) + '" class="modal__thumb' + (i === 0 ? ' active' : '') + '" data-index="' + i + '" loading="lazy">';
    }).join('');
    return '<div class="modal__thumbnails" id="modal-thumbnails">' + thumbs + '</div>';
  }

  function buildTabs(hasPlans, hasDocs) {
    let tabs =
      '<div class="modal__tabs">' +
        '<button class="modal__tab active" data-tab="details">Dettagli</button>';
    if (hasPlans) tabs += '<button class="modal__tab" data-tab="plans">Planimetrie</button>';
    if (hasDocs)  tabs += '<button class="modal__tab" data-tab="docs">Documenti</button>';
    tabs += '</div>';
    return tabs;
  }

  function buildTabPanel(id, active, inner) {
    return '<div class="modal__tab-panel' + (active ? ' active' : '') + '" data-panel="' + id + '">' + inner + '</div>';
  }

  function buildDetailsContent(p) {
    const specs =
      (p.specs.bedrooms  ? '<div class="modal__spec-item">' + iconBed()  + '<span>' + p.specs.bedrooms + ' camere</span></div>' : '') +
      (p.specs.bathrooms ? '<div class="modal__spec-item">' + iconBath() + '<span>' + p.specs.bathrooms + ' bagni</span></div>' : '') +
      (p.specs.sqm       ? '<div class="modal__spec-item">' + iconSqm()  + '<span>' + p.specs.sqm + ' m²</span></div>' : '') +
      (p.specs.sqmGarden ? '<div class="modal__spec-item">' + iconGarden() + '<span>' + p.specs.sqmGarden + ' m² giardino</span></div>' : '') +
      (p.specs.pool      ? '<div class="modal__spec-item">' + iconPool()  + '<span>Piscina</span></div>' : '') +
      (p.specs.seaview   ? '<div class="modal__spec-item">' + iconSea()   + '<span>Vista mare</span></div>' : '') +
      (p.specs.parking   ? '<div class="modal__spec-item">' + iconCar()   + '<span>Parcheggio</span></div>' : '');

    const featureItems = (p.features || []).map(function (f) {
      return '<li class="modal__feature-item">' + f + '</li>';
    }).join('');

    return (
      '<p class="modal__location">' + p.location.city + ' · ' + p.location.area + ', ' + p.location.region + '</p>' +
      '<h2 class="modal__title">' + p.name + '</h2>' +
      '<p class="modal__price">' + p.price.display + '</p>' +
      '<div class="modal__specs">' + specs + '</div>' +
      '<p class="modal__desc-short">' + p.description.short + '</p>' +
      '<p class="modal__desc-long">' + p.description.long + '</p>' +
      (featureItems ? '<h3 class="modal__features-title">Caratteristiche</h3><ul class="modal__features-list">' + featureItems + '</ul>' : '')
    );
  }

  function buildPlansContent(images) {
    if (!images.length) return '<p style="color:var(--text-muted);padding:1rem 0">Nessuna planimetria disponibile.</p>';
    const imgs = images.map(function (src) {
      return '<img src="' + src + '" alt="Planimetria" class="modal__arch-img" loading="lazy">';
    }).join('');
    return '<div class="modal__arch-grid">' + imgs + '</div>';
  }

  function buildDocsContent(docs) {
    if (!docs.length) return '<p style="color:var(--text-muted);padding:1rem 0">Nessun documento disponibile.</p>';
    const links = docs.map(function (d) {
      return (
        '<a href="' + d.file + '" target="_blank" rel="noopener" class="modal__doc-link">' +
          iconPdf() +
          d.label +
        '</a>'
      );
    }).join('');
    return '<div class="modal__docs-list">' + links + '</div>';
  }

  function buildCtaBar(p) {
    return (
      '<div class="modal__cta-bar">' +
        '<button class="btn btn--gold" onclick="window.prefillContactForm(\'' + p.id + '\')">Richiedi Info</button>' +
        '<a href="tel:' + SITE_CONFIG.phonePlain + '" class="btn btn--outline-dark">' + iconPhone() + 'Chiama</a>' +
        '<a href="https://wa.me/' + SITE_CONFIG.whatsapp + '?text=' + encodeURIComponent('Ciao, sono interessato a ' + p.name + ' — ' + p.subtitle + '. Potete inviarmi maggiori informazioni?') + '" target="_blank" rel="noopener" class="btn btn--outline-dark">' + iconWa() + 'WhatsApp</a>' +
      '</div>'
    );
  }

  /* ---------- Modal gallery navigation ---------- */
  function wireModalGallery() {
    const galleryImg = document.getElementById('modal-gallery-img');
    const galleryEl  = document.getElementById('modal-gallery');
    const thumbsEl   = document.getElementById('modal-thumbnails');

    function goTo(index) {
      if (!currentImages.length) return;
      currentImgIndex = (index + currentImages.length) % currentImages.length;
      if (galleryImg) {
        galleryImg.src = currentImages[currentImgIndex];
        galleryImg.alt = 'Foto ' + (currentImgIndex + 1);
      }
      if (thumbsEl) {
        thumbsEl.querySelectorAll('.modal__thumb').forEach(function (t, i) {
          t.classList.toggle('active', i === currentImgIndex);
        });
      }
    }

    // Prev/next buttons
    const prevBtn = content.querySelector('.modal__gallery-nav--prev');
    const nextBtn = content.querySelector('.modal__gallery-nav--next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(currentImgIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(currentImgIndex + 1); });

    // Thumbnails
    if (thumbsEl) {
      thumbsEl.querySelectorAll('.modal__thumb').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          goTo(parseInt(thumb.dataset.index, 10));
        });
      });
    }

    // Click main image → open lightbox
    if (galleryEl) {
      galleryEl.addEventListener('click', function (e) {
        if (e.target.closest('.modal__gallery-nav')) return;
        if (typeof openLightbox === 'function') {
          openLightbox(currentImages, currentImgIndex);
        }
      });
    }

    // Architectural images → lightbox
    if (content) {
      content.querySelectorAll('.modal__arch-img').forEach(function (img, i) {
        img.addEventListener('click', function () {
          const p = PROPERTIES.find(function (x) {
            return x.images && x.images.includes(currentImages[0]);
          });
          const archImgs = p ? (p.architecturalImages || []) : [];
          if (typeof openLightbox === 'function') {
            openLightbox(archImgs, i);
          }
        });
      });
    }
  }

  /* ---------- Tab switching ---------- */
  function wireTabs() {
    if (!content) return;
    content.querySelectorAll('.modal__tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        content.querySelectorAll('.modal__tab').forEach(function (t) { t.classList.remove('active'); });
        content.querySelectorAll('.modal__tab-panel').forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        const panel = content.querySelector('[data-panel="' + tab.dataset.tab + '"]');
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ---------- SVG icons ---------- */
  function svg(path, size) {
    size = size || 16;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
  }

  function iconBed()    { return svg('<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>'); }
  function iconBath()   { return svg('<path d="M3 3v14"/><path d="M3 10h12a2 2 0 0 1 2 2v1a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V3"/><path d="M3 6h8"/>'); }
  function iconSqm()    { return svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>'); }
  function iconGarden() { return svg('<path d="M12 22V12"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M12 12C12 7 7 3 7 3s-1 4 1 6"/><path d="M12 12c0-5 5-9 5-9s1 4-1 6"/>'); }
  function iconPool()   { return svg('<path d="M2 12h20M2 20h20M2 8c3-4 6-4 10 0s7 4 10 0M2 16c3-4 6-4 10 0s7 4 10 0"/>'); }
  function iconSea()    { return svg('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10A15.3 15.3 0 0 1 8 12 15.3 15.3 0 0 1 12 2z"/>'); }
  function iconCar()    { return svg('<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'); }
  function iconPhone()  { return svg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.63 18.7 19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.4 2.68h3a2 2 0 0 1 2 1.72c.127.96.361 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>'); }
  function iconPrev()   { return svg('<polyline points="15 18 9 12 15 6"/>', 20); }
  function iconNext()   { return svg('<polyline points="9 18 15 12 9 6"/>', 20); }
  function iconPdf()    { return svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>', 20); }
  function iconWa()     {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  }

  /* ---------- Init ---------- */
  // Scripts are at bottom of <body>, DOM is already available — no need to wait
  renderCards();

})();

'use strict';
(function () {

  document.addEventListener('DOMContentLoaded', boot);

  /* ── Boot ──────────────────────────────────────────────────────── */
  function boot() {
    var xdc = document.querySelector('x-dc');
    if (!xdc) return;

    /* 1. Inject <helmet> children into <head> */
    var helmet = xdc.querySelector(':scope > helmet');
    if (helmet) {
      var seen = new Set();
      [].forEach.call(helmet.children, function (child) {
        var key = child.outerHTML;
        if (!seen.has(key)) { seen.add(key); document.head.appendChild(child.cloneNode(true)); }
      });
    }

    /* 2. Unwrap <x-dc>: move all non-helmet children into the document */
    var frag = document.createDocumentFragment();
    [].slice.call(xdc.childNodes).forEach(function (node) {
      if (node !== helmet) frag.appendChild(node);
    });
    xdc.replaceWith(frag);

    /* 3. Common page features */
    initHashNav();
    initStickyHeader();
    initKvSlider();
  }

  /* ── Hash anchor navigation (84px offset for fixed header) ─────── */
  function initHashNav() {
    function jump(smooth) {
      var h = location.hash;
      if (!h || h.length < 2) return;
      var el = document.getElementById(decodeURIComponent(h.slice(1)));
      if (!el) return;
      var y = el.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' });
    }
    window.addEventListener('load', function () { setTimeout(function () { jump(false); }, 350); });
    window.addEventListener('hashchange', function () { jump(true); });
  }

  /* ── Sticky header: toggle .scrolled when KV sentinel leaves viewport ── */
  function initStickyHeader() {
    var hd  = document.querySelector('.hd');
    var hd2 = document.querySelector('.hd2');
    if (!hd2) return;

    var sentinel = document.querySelector('.kv-sentinel');

    function apply(scrolled) {
      if (hd) hd.classList.toggle('scrolled', scrolled);
      hd2.classList.toggle('scrolled', scrolled);
    }

    if (sentinel && window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        apply(!entries[0].isIntersecting);
      }, { threshold: 0 }).observe(sentinel);
    }

    /* Scroll fallback — also sets correct state on initial load */
    var onScroll = function () {
      apply((window.scrollY || document.documentElement.scrollTop) > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── KV image slider with slow-zoom effect ──────────────────────── */
  function initKvSlider() {
    var slides = document.querySelectorAll('.kv-slide');
    if (slides.length < 2) return;

    var cur = 0;

    function zoom(idx) {
      var img = slides[idx].querySelector('.kv-img');
      if (!img) return;
      img.style.transition = 'none';
      img.style.transform = 'scale(1.0)';
      void img.offsetWidth;                        /* force reflow to commit reset */
      img.style.transition = 'transform 6.2s ease-out';
      img.style.transform = 'scale(1.09)';
    }

    zoom(0);
    setInterval(function () {
      var next = (cur + 1) % slides.length;
      zoom(next);
      slides[next].classList.add('is-active');
      slides[cur].classList.remove('is-active');
      cur = next;
    }, 5200);
  }

})();

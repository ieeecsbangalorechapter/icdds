/**
 * ICDDS 2026 – Site-wide JavaScript
 * Inspired by AIMLSystems.org/2025 theme
 */

(function () {
  'use strict';

  /* ---- Navigation HTML ---- */
  const NAV_HTML = `
    <header id="header">
      <div class="container-fluid">
        <div id="logo">
          <a href="index.html">ICDDS 2026</a>
        </div>
        <button id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav id="nav-menu-container" role="navigation" aria-label="Main navigation">
          <ul class="nav-menu">
            <li data-page="index"><a href="index.html">Home</a></li>
            <li data-page="committee">
              <a href="Organizing-Committee.html">Committees ▾</a>
              <ul class="nav-dropdown">
                <li><a href="Organizing-Committee.html">Organizing Committee</a></li>
                <li><a href="Program-Committee.html">Program Committee</a></li>
              </ul>
            </li>
            <li data-page="calls">
              <a href="CallForPapers.html">Calls ▾</a>
              <ul class="nav-dropdown">
                <li><a href="CallForPapers.html">Call for Papers</a></li>
                <li><a href="CallForPosters.html">Call for Posters</a></li>
                <li><a href="Foundational-Research.html">Foundational Research</a></li>
                <li><a href="Systems-Research.html">Systems Research</a></li>
                <li><a href="Applications.html">Applications</a></li>
              </ul>
            </li>
            <li data-page="speakers"><a href="speakers.html">Speakers</a></li>
            <li data-page="program">
              <a href="Program-Schedule.html">Program ▾</a>
              <ul class="nav-dropdown">
                <li><a href="Program-Schedule.html">Program Schedule</a></li>
                <li><a href="accepted-papers.html">Accepted Papers</a></li>
              </ul>
            </li>
            <li data-page="authors">
              <a href="AuthorGuide.html">Authors ▾</a>
              <ul class="nav-dropdown">
                <li><a href="AuthorGuide.html">Author Guidelines</a></li>
                <li><a href="final-camera-ready-guidelines.html">Camera-Ready Guidelines</a></li>
              </ul>
            </li>
            <li data-page="registration"><a href="registration.html">Registration</a></li>
            <li data-page="venue"><a href="venue.html">Venue</a></li>
            <li data-page="contact"><a href="contact.html">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `;

  /* ---- Footer HTML ---- */
  const FOOTER_HTML = `
    <footer id="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <h4>ICDDS 2026</h4>
            <p>5th International Conference on Data, Decision and Systems<br>
            December 11-13, 2026<br>
            CHRIST University, Bangalore, India</p>
            <div class="social-links">
              <a href="#" aria-label="LinkedIn"><i class="fa fa-linkedin"></i></a>
              <a href="#" aria-label="Twitter"><i class="fa fa-twitter"></i></a>
              <a href="#" aria-label="Facebook"><i class="fa fa-facebook"></i></a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="CallForPapers.html">Call for Papers</a></li>
              <li><a href="speakers.html">Speakers</a></li>
              <li><a href="Program-Schedule.html">Program Schedule</a></li>
              <li><a href="registration.html">Registration</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Committees</h4>
            <ul>
              <li><a href="Organizing-Committee.html">Organizing Committee</a></li>
              <li><a href="Program-Committee.html">Program Committee</a></li>
              <li><a href="Technical-Committee.html">Technical Committee</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="contact.html">Contact Us</a></li>
              <li><a href="venue.html">Venue</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 ICDDS. Organized by IEEE Computer Society Bangalore Chapter &amp; CHRIST University.</p>
        </div>
      </div>
    </footer>
  `;

  /* ---- Inject Header ---- */
  function injectHeader() {
    const placeholder = document.getElementById('site-header');
    if (placeholder) {
      placeholder.outerHTML = NAV_HTML;
    } else {
      document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
    }
  }

  /* ---- Inject Footer ---- */
  function injectFooter() {
    const placeholder = document.getElementById('site-footer');
    if (placeholder) {
      placeholder.outerHTML = FOOTER_HTML;
    } else {
      document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
    }
  }

  /* ---- Mark active nav item ---- */
  function markActive() {
    const page = document.body.getAttribute('data-page') || '';
    if (!page) return;
    const li = document.querySelector(`#header .nav-menu > li[data-page="${page}"]`);
    if (li) li.classList.add('menu-active');
  }

  /* ---- Mobile toggle ---- */
  function initMobileNav() {
    const btn = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav-menu-container');
    if (!btn || !nav) return;

    btn.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      btn.classList.toggle('active', open);
      btn.setAttribute('aria-expanded', String(open));
    });

    // Mobile dropdown toggle
    document.querySelectorAll('#nav-menu-container .nav-menu > li > a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (window.innerWidth > 980) return;
        const dropdown = a.parentElement.querySelector('.nav-dropdown');
        if (!dropdown) return;
        e.preventDefault();
        a.parentElement.classList.toggle('open');
      });
    });

    // Close nav when clicking outside
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Scroll-based animations ---- */
  function initScrollAnimations() {
    const animEls = document.querySelectorAll('.fade-in, .fade-left, .fade-right');
    if (!animEls.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Sticky header shadow ---- */
  function initStickyHeader() {
    window.addEventListener('scroll', function () {
      const h = document.getElementById('header');
      if (!h) return;
      h.style.boxShadow = window.scrollY > 10
        ? '0 2px 12px rgba(0,0,0,.12)'
        : '0 1px 0 rgba(0,0,0,.1)';
    });
  }

  /* ---- Accordion ---- */
  function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(function (header) {
      header.addEventListener('click', function () {
        const item = header.parentElement;
        const isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.accordion-item.open').forEach(function (i) {
          i.classList.remove('open');
        });
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ---- Countdown timer ---- */
  function initCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;
    const target = new Date(el.getAttribute('data-date')).getTime();

    function tick() {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        el.innerHTML = '<span class="countdown-over">Conference has started!</span>';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      el.innerHTML = `
        <div class="countdown-unit"><span class="num">${d}</span><span class="lbl">Days</span></div>
        <div class="countdown-unit"><span class="num">${h.toString().padStart(2,'0')}</span><span class="lbl">Hours</span></div>
        <div class="countdown-unit"><span class="num">${m.toString().padStart(2,'0')}</span><span class="lbl">Mins</span></div>
        <div class="countdown-unit"><span class="num">${s.toString().padStart(2,'0')}</span><span class="lbl">Secs</span></div>
      `;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---- Init on DOMContentLoaded ---- */
  document.addEventListener('DOMContentLoaded', function () {
    injectHeader();
    injectFooter();
    markActive();
    initMobileNav();
    initScrollAnimations();
    initStickyHeader();
    initAccordions();
    initCountdown();
  });

})();

/* ============================================================
   ZYMA SYSTEMS — case-study.js
   Case study page enhancements
   script.js handles: nav, reveal, counters, mobile overlay,
   page transitions, Zyra chatbot
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── TOC scroll spy ── */
  const tocLinks = document.querySelectorAll('.cs-toc .toc-link');
  if (tocLinks.length) {
    const sections = document.querySelectorAll('.cs-section[id]');

    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.cs-toc .toc-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });

    sections.forEach(s => spy.observe(s));
  }

  /* ── Smooth scroll for TOC links ── */
  document.querySelectorAll('.cs-toc .toc-link').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-h')) || 64;
          const top = target.getBoundingClientRect().top + window.scrollY - offset - 20;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

});

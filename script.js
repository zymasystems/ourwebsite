/* ============================================================
   ZYMA SYSTEMS — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scrolled nav border ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Mobile overlay nav ── */
  const hamburger = document.getElementById('nav-hamburger');
  const overlay   = document.getElementById('mobile-overlay');

  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => {
      const isOpen = overlay.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click (with slight delay for transition)
    overlay.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#')) {
          e.preventDefault();
          overlay.classList.remove('open');
          hamburger.classList.remove('open');
          document.body.style.overflow = '';
          setTimeout(() => { window.location.href = href; }, 300);
        }
      });
    });

    // Close on overlay bg click
    overlay.querySelector('.mobile-overlay-bg').addEventListener('click', () => {
      overlay.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  /* ── Reveal on scroll ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Active nav link (desktop) ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
  document.querySelectorAll('.footer-col a').forEach(a => {
    if (a.getAttribute('href') === currentPath) a.classList.add('active');
  });

  /* ── Counter animation ── */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = 1600;
    const startTime = performance.now();
    const isDecimal = String(target).includes('.');

    function update(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = target * eased;
      el.textContent = prefix + (isDecimal ? value.toFixed(2) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-target]');
  if (counters.length) {
    const cObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cObserver.observe(el));
  }

  /* ── Process step layout fix for mobile ── */
  function wrapProcessSteps() {
    if (window.innerWidth <= 768) {
      document.querySelectorAll('.process-step').forEach(step => {
        const num = step.querySelector('.process-num');
        if (num && !step.querySelector('.process-step-body')) {
          const body = document.createElement('div');
          body.className = 'process-step-body';
          while (step.children.length > 1) {
            body.appendChild(step.children[1]);
          }
          step.appendChild(body);
        }
      });
    }
  }
  wrapProcessSteps();

 /* ── Contact form (API version) ── */
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = document.querySelector('.form-submit');

  const data = {
    fullName: document.getElementById('full-name').value,
    businessName: document.getElementById('business-name').value,
    email: document.getElementById('email').value,
    requirements: document.getElementById('requirements').value
  };

  btn.innerHTML = 'Sending...';
  btn.disabled = true;

  try {
    const res = await fetch('https://api.zyma.co.za/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // ⚠️ DO NOT assume JSON will always parse safely
    let resultText = await res.text();

    // If backend is OK (this is what matters)
    if (res.ok) {
      // SUCCESS PATH
      window.location.href = "success.html";
      return;
    }

    // If backend failed
    console.log("Server response:", resultText);
    alert("Failed to send message. Please try again.");

  } catch (err) {
    console.log("Network error:", err);

    // IMPORTANT:
    // Even if error happens, email might still have sent (as you saw)
    alert("Request sent, but we could not confirm success. Please check your email confirmation or try again.");
  }

  btn.innerHTML = 'Request a Free Consultation →';
  btn.disabled = false;
});

/*── Legal page: TOC scroll spy ── */
const tocLinks = document.querySelectorAll('.toc-link');
if (tocLinks.length) {
  const sections = document.querySelectorAll('.legal-section');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  sections.forEach(s => spy.observe(s));
}

  /* ── Smooth page transitions ── */
  document.querySelectorAll('a[href$=".html"], a[href="index.html"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (this.closest('.mobile-overlay')) return; // handled above
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.22s ease';
      setTimeout(() => { window.location.href = href; }, 220);
    });
  });

  // Fade in on load
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.32s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  });

  /* ── Hero typewriter ── */
  const typeTarget = document.getElementById('hero-type');
  if (typeTarget) {
    const words = ['RUN', 'POWER', 'SCALE', 'DRIVE','GROW'];
    let wordIdx = 0, charIdx = 0, deleting = false;
    typeTarget.style.borderRight = '2px solid #e8890c';

    function type() {
      const word = words[wordIdx];
      if (!deleting) {
        typeTarget.textContent = word.slice(0, ++charIdx);
        if (charIdx === word.length) { deleting = true; setTimeout(type, 1400); return; }
      } else {
        typeTarget.textContent = word.slice(0, --charIdx);
        if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; }
      }
      setTimeout(type, deleting ? 60 : 100);
    }
    setTimeout(type, 800);
  }

});
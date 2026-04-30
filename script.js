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

  function openNav() {
    overlay.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Hide chat bubble when nav is open
    const chatToggle = document.querySelector('.n8n-chat .chat-toggle, #n8n-chat-toggle, [class*="chat-toggle"]');
    if (chatToggle) chatToggle.style.display = 'none';
    const chatWidget = document.querySelector('.n8n-chat');
    if (chatWidget) chatWidget.style.visibility = 'hidden';
  }

  function closeNav() {
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
    // Restore chat bubble
    const chatWidget = document.querySelector('.n8n-chat');
    if (chatWidget) chatWidget.style.visibility = 'visible';
  }

  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => {
      const isOpen = overlay.classList.contains('open');
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close on link click (with slight delay for transition)
    overlay.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#')) {
          e.preventDefault();
          closeNav();
          setTimeout(() => { window.location.href = href; }, 300);
        } else {
          closeNav();
        }
      });
    });

    // Close on overlay bg click
    overlay.querySelector('.mobile-overlay-bg').addEventListener('click', () => {
      closeNav();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeNav();
      }
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

  /* ── Contact form ── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
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
        const res = await fetch('https://api.zyma.co.za/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const text = await res.text();
        console.log("API RESPONSE:", text);
        if (res.ok) {
          window.location.href = "success.html";
          return;
        }
        alert("Failed to send message. Please try again.");
      } catch (err) {
        console.log("NETWORK ERROR:", err);
        alert("Network error. Please try again.");
      }
      btn.innerHTML = 'Request a Free Consultation →';
      btn.disabled = false;
    });
  }

  /* ── Legal page: TOC scroll spy ── */
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
      if (this.closest('.mobile-overlay')) return;
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
    const words = ['RUN', 'POWER', 'SCALE', 'DRIVE', 'GROW'];
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

  /* ── Zyra lead capture → API ── */
  // Watch for n8n chat to load, then intercept messages
  function initZyraLeadCapture() {
    // Notification sound for incoming bot messages
    const botSound = new Audio('images/arnav_geddada-ui-sound-374228.mp3');
    botSound.preload = 'auto';
    botSound.volume = 0.8;

    // Track collected fields across conversation
    const leadData = { fullName: null, email: null, businessName: null, requirements: null };
    let submitted = false;

    // Observe DOM for n8n chat messages appearing
    const chatObserver = new MutationObserver(() => {
      const messages = document.querySelectorAll('.n8n-chat .chat-message--bot, [class*="chat-message-bot"]');
      messages.forEach(msg => {
        if (msg.dataset.zyraChecked) return;
        msg.dataset.zyraChecked = 'true';
        botSound.play().catch(() => {});
        const text = msg.textContent || '';

        // Check if bot confirmed it has all details (trigger phrase from system prompt)
        if (
          !submitted &&
          (text.includes('reach out to') || text.includes('within 1–2 business days') || text.includes('1-2 business days')) &&
          text.includes('@')
        ) {
          // Extract email from message
          const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
          if (emailMatch) leadData.email = emailMatch[0];

          // Try to find name — look for previous user messages
          const userMsgs = document.querySelectorAll('.n8n-chat .chat-message--user, [class*="chat-message-user"]');
          userMsgs.forEach(umsg => {
            const t = umsg.textContent.trim();
            // Simple heuristic: short messages likely contain name/business
            if (t.length > 2 && t.length < 60 && !t.includes('@') && !leadData.fullName) {
              leadData.fullName = t;
            }
          });

          if (!leadData.fullName) leadData.fullName = 'Zyra Chat Lead';
          if (!leadData.businessName) leadData.businessName = 'Via Zyra Chatbot';
          if (!leadData.requirements) leadData.requirements = 'Lead collected via Zyra chatbot — follow up required.';

          submitLeadToAPI(leadData);
        }
      });
    });

    // Start observing once chat loads
    const waitForChat = setInterval(() => {
      const chatWindow = document.querySelector('.n8n-chat');
      if (chatWindow) {
        clearInterval(waitForChat);
        chatObserver.observe(chatWindow, { childList: true, subtree: true });
      }
    }, 1000);

    async function submitLeadToAPI(data) {
      if (submitted) return;
      submitted = true;
      console.log('Zyra: Submitting lead to API', data);
      try {
        const res = await fetch('https://api.zyma.co.za/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        console.log('Zyra lead submitted:', res.status);
      } catch (err) {
        console.error('Zyra lead submission failed:', err);
      }
    }
  }

  initZyraLeadCapture();

});

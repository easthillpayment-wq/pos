/* =============================================
   SWIFTPAY SOLUTIONS — script.js
   Email: easthillpayment@gmail.com via Formspree
   ============================================= */

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---- Mobile menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  mobileMenu.style.display = 'flex';
  mobileOverlay.classList.add('open');
  mobileOverlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
});

function closeMobile() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    if (!mobileMenu.classList.contains('open')) {
      mobileMenu.style.display = 'none';
      mobileOverlay.style.display = 'none';
    }
  }, 320);
}

if (mobileClose) mobileClose.addEventListener('click', closeMobile);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobile);

/* ---- Floating CTA visibility ---- */
const floatingCta = document.getElementById('floatingCta');
if (floatingCta) {
  window.addEventListener('scroll', () => {
    floatingCta.classList.toggle('visible', window.scrollY > 600);
  });
}

/* ============================================================
   EMAIL SENDING via Formspree
   Steps to activate:
   1. Go to https://formspree.io and sign up (free)
   2. Create a new form, set recipient to: easthillpayment@gmail.com
   3. Copy your Form ID (looks like: xyzabcde)
   4. Replace 'YOUR_FORM_ID' below with that ID
   ============================================================ */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

async function sendToFormspree(formData, endpoint) {
  const data = {};
  formData.forEach((v, k) => { data[k] = v; });
  data['_replyto'] = data['Email'] || data['email'] || '';
  data['_subject'] = 'SwiftPay — New Inquiry from ' + (data['Business Name'] || data['Contact Name'] || 'Website Visitor');

  const res = await fetch(endpoint || FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Submit failed');
  return res.json();
}

/* ---- Hero / Quote form submit ---- */
async function submitForm(e, successId, endpoint) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-btn');
  const btnText = btn ? btn.querySelector('.btn-text') : null;
  const btnLoader = btn ? btn.querySelector('.btn-loader') : null;

  if (btn) btn.disabled = true;
  if (btnText) btnText.style.display = 'none';
  if (btnLoader) btnLoader.style.display = 'inline';

  try {
    await sendToFormspree(new FormData(form), endpoint);
  } catch (err) {
    console.warn('Form submission error. Check your Formspree ID in script.js:', err.message);
  }

  setTimeout(() => {
    form.style.display = 'none';
    const successEl = document.getElementById(successId || 'formSuccess');
    if (successEl) {
      successEl.style.display = 'flex';
      successEl.style.flexDirection = 'column';
      successEl.style.alignItems = 'center';
    }
  }, 900);
}

/* ---- Contact form submit ---- */
async function submitContact(e, endpoint) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-btn');
  const origText = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = 'Sending\u2026'; }

  try {
    await sendToFormspree(new FormData(form), endpoint);
    if (btn) {
      btn.textContent = '\u2713 Message Sent!';
      btn.style.background = 'var(--c-green)';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = origText;
        btn.style.background = '';
        form.reset();
      }, 3000);
    }
  } catch (err) {
    if (btn) {
      btn.textContent = '\u26a0 Error — try again';
      btn.style.background = 'var(--c-red)';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = origText;
        btn.style.background = '';
      }, 3000);
    }
  }
}

/* ---- Generic form for sub-pages (Clover / Moneris / Square) ---- */
async function submitPageForm(e, formEl, successId) {
  e.preventDefault();
  const btn = formEl ? formEl.querySelector('button[type="submit"], .form-btn') : null;
  if (btn) { btn.disabled = true; btn.textContent = 'Sending\u2026'; }

  try {
    await sendToFormspree(new FormData(formEl));
  } catch (err) {
    console.warn('Form error:', err.message);
  }

  setTimeout(() => {
    if (formEl) formEl.style.display = 'none';
    const successEl = document.getElementById(successId);
    if (successEl) {
      successEl.style.display = 'flex';
      successEl.style.flexDirection = 'column';
      successEl.style.alignItems = 'center';
    }
  }, 900);
}

/* ---- Stat counter animation ---- */
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const step = target / (1800 / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

/* ---- Intersection Observers ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.12 });

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) { animateCounters(); statsObserver.unobserve(entry.target); } });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
  /* Reveal animations */
  document.querySelectorAll(
    '.sol-card, .pos-card, .why-card, .testimonial-card, .contact-info, .contact-form-wrap,' +
    '.guarantee-inner, .section-header, .stat-item, .ind-item, .feat-card, .mf-card,' +
    '.wc-card, .sh-item, .dp-panel, .device-hero-block, .mn-feat-card, .sq-feat-card, .sq-device-card'
  ).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    revealObserver.observe(el);
  });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) statsObserver.observe(statsSection);

  /* Active nav highlight */
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => { a.style.color = a.getAttribute('href') === '#' + id ? 'var(--c-white)' : ''; });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(s => activeObserver.observe(s));

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }
    });
  });

  /* Parallax orbs */
  const orb1 = document.querySelector('.orb1, .ch-orb1, .mh-orb1, .sq-orb1');
  const orb2 = document.querySelector('.orb2, .ch-orb2, .mh-orb2, .sq-orb2');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (orb1) orb1.style.transform = 'translateY(' + (y * 0.12) + 'px)';
    if (orb2) orb2.style.transform = 'translateY(' + (y * -0.08) + 'px)';
  }, { passive: true });

  /* Moneris link routing in dropdown and cards */
  document.querySelectorAll('a[href="moneris.html"]').forEach(el => {
    el.addEventListener('click', event => {
      event.preventDefault();
      window.location.href = 'moneris.html';
    });
  });
});

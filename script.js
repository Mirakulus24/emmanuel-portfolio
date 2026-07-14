document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const yearTarget = document.querySelector('[data-year]');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-links');
  const progressBar = document.querySelector('.scroll-progress');
  const backToTop = document.querySelector('.back-to-top');
  const heroTyped = document.querySelector('.hero-typed');

  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  const setActiveLink = () => {
    let current = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${current}`);
    });
  };

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (scrollTop / height) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (backToTop) {
      backToTop.style.display = scrollTop > 500 ? 'block' : 'none';
    }
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (heroTyped) {
    const phrases = [
      'Helping NGOs, Churches & Businesses Build Modern Digital Experiences',
      'Building Fast, Responsive Websites That Help Organizations Grow',
      'Designing Digital Experiences With Purpose and Clarity'
    ];
    let phraseIndex = 0;
    let charIndex = 0;

    const typeLoop = () => {
      heroTyped.textContent = phrases[phraseIndex].slice(0, charIndex);
      charIndex += 1;

      if (charIndex > phrases[phraseIndex].length) {
        setTimeout(() => {
          charIndex = 0;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          typeLoop();
        }, 1200);
        return;
      }

      setTimeout(typeLoop, 60);
    };

    typeLoop();
  }

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalLabel = submitButton?.textContent || 'Send Message';

      formStatus.textContent = '';
      formStatus.className = 'form-status';

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(contactForm)
        });

        if (response.ok) {
          formStatus.textContent = 'Thanks! Your message has been sent successfully.';
          formStatus.classList.add('success');
          contactForm.reset();
        } else {
          throw new Error('Something went wrong. Please email me directly instead.');
        }
      } catch (error) {
        formStatus.textContent = error.message || 'Unable to send message right now.';
        formStatus.classList.add('error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalLabel;
        }
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

  setActiveLink();
  updateProgress();
  window.addEventListener('scroll', () => {
    setActiveLink();
    updateProgress();
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

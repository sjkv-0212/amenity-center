document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Scroll Progress Bar & Floating Back-To-Top Button
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  document.body.appendChild(progressBar);

  const header = document.querySelector('.site-header');
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Scroll to top');
  backToTop.innerHTML = '↑';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    if (totalScroll > 0) {
      progressBar.style.width = `${(currentScroll / totalScroll) * 100}%`;
    }

    if (header) {
      if (currentScroll > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (currentScroll > 320) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 3. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '☰';
      }
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '☰';
      });
    });
  }

  // 4. Kinetic Word Rotator
  const rotator = document.querySelector('.word-rotator');
  if (rotator) {
    const words = rotator.querySelectorAll('em');
    if (words.length > 1) {
      let currentIndex = 0;
      setInterval(() => {
        const currentWord = words[currentIndex];
        currentWord.classList.remove('active');
        currentWord.classList.add('prev');

        currentIndex = (currentIndex + 1) % words.length;
        const nextWord = words[currentIndex];
        nextWord.classList.remove('prev');
        nextWord.classList.add('active');
      }, 2600);
    }
  }

  // 5. Interactive Golden Canvas Particle System
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight || 680);

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight || 680;
    });

    const particles = [];
    const particleCount = Math.min(width < 768 ? 30 : 65, 80);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 0.8;
        this.baseSize = this.size;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.goldTone = Math.random() > 0.4 ? 'rgba(240, 217, 154,' : 'rgba(198, 161, 91,';
      }

      update(mouseX, mouseY) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Subtle mouse interactivity
        if (mouseX && mouseY) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            this.x -= (dx / dist) * force * 2.5;
            this.y -= (dy / dist) * force * 2.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.goldTone} ${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(240, 217, 154, 0.6)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouse = { x: null, y: null };
    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw faint connection constellations
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(198, 161, 91, ${0.18 * (1 - distance / 90)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update(mouse.x, mouse.y);
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // 6. Animated Counter Numbers
  const statNumbers = document.querySelectorAll('[data-target]');
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let current = 0;
          const duration = 1600;
          const stepTime = Math.max(Math.floor(duration / (target || 1)), 25);

          const timer = setInterval(() => {
            current += Math.ceil(target / (duration / stepTime));
            if (current >= target) {
              current = target;
              el.textContent = (target < 10 && target >= 0 && !suffix ? `0${target}` : target) + suffix;
              clearInterval(timer);
            } else {
              el.textContent = (current < 10 ? `0${current}` : current) + suffix;
            }
          }, stepTime);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach((num) => counterObserver.observe(num));
  }

  // 7. Staggered Scroll Reveal Observer
  const revealElements = document.querySelectorAll(
    '.service-card, .location-card, .contact-card, .category-grid > div, .feature-list > div, .split > div, .section-heading, .cta, .stat-item'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach((el, index) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
      const delayMod = (index % 4) + 1;
      el.classList.add(`reveal-delay-${delayMod}`);
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach((el) => el.classList.add('in-view'));
  }

  // 8. 3D Tilt with Real-time Parallax on Cards
  const interactiveCards = document.querySelectorAll('.service-card, .location-card, .contact-card, .stat-item');
  interactiveCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 9. Interactive Button Ripple Feedback
  const buttons = document.querySelectorAll('.btn, .nav-cta');
  buttons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;
      const rect = btn.getBoundingClientRect();

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('btn-ripple');

      const ripple = btn.getElementsByClassName('btn-ripple')[0];
      if (ripple) {
        ripple.remove();
      }

      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });

  // 10. Smooth Ambient Cursor Glow Tracker
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderGlow() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(renderGlow);
    }
    renderGlow();
  }

  // 11. Video Showcase Controls
  const video = document.getElementById('showcaseVideo');
  const playBtn = document.getElementById('videoPlayPauseBtn');
  const soundBtn = document.getElementById('videoSoundBtn');

  if (video && playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play();
        playBtn.innerHTML = '⏸ Pause';
      } else {
        video.pause();
        playBtn.innerHTML = '▶ Play';
      }
    });
  }

  if (video && soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      soundBtn.innerHTML = video.muted ? '🔇 Sound Off' : '🔊 Sound On';
    });
  }
});


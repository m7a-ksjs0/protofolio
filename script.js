
// ===== PARTICLES =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '168,85,247' : '6,182,212';
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(168,85,247,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 400);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

function updateActiveNav() {
  const sections = ['home','about','skills','projects','contact'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 200) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

// ===== TYPED TEXT =====
const texts = ['Front-End Developer', 'HTML & CSS Specialist', 'Bootstrap Expert', 'Creative Coder'];
let ti = 0, ci = 0, isDeleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const current = texts[ti];
  typedEl.textContent = isDeleting ? current.substring(0, ci--) : current.substring(0, ci++);
  let delay = isDeleting ? 60 : 100;
  if (!isDeleting && ci === current.length + 1) { delay = 2000; isDeleting = true; }
  else if (isDeleting && ci === 0) { isDeleting = false; ti = (ti + 1) % texts.length; delay = 400; }
  setTimeout(type, delay);
}
type();

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = +el.dataset.target;
    let count = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      count += step;
      if (count >= target) { el.textContent = target; clearInterval(timer); }
      else el.textContent = Math.floor(count);
    }, 40);
  });
}

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('hero-stats')) animateCounters();
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section-header, .about-grid, .skill-category, .project-card, .contact-grid').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ===== SKILL BARS =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

// Hero stats observer
const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  statsEl.classList.add('hero-stats');
  revealObserver.observe(statsEl);
}
new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) animateCounters();
}, { threshold: 0.5 }).observe(statsEl);

// ===== PROJECT FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? 'block' : 'none';
      if (show) {
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'fadeInUp 0.5s ease forwards';
      }
    });
  });
});

// ===== CONTACT FORM =====
// Standard submission is now used for better reliability on first setup
/*
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = document.getElementById('send-btn');
  const form = this;
  const formData = new FormData(form);

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  // Using FormSubmit.co - no account needed, just confirm your email on the first submission!
  const data = Object.fromEntries(formData.entries());
  fetch('https://formsubmit.co/ajax/samehhh1971@gmail.com', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    if (response.ok) {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      form.reset();
    } else {
      btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error!';
    }
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }).catch(error => {
    btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error!';
    btn.disabled = false;
  });
});
*/

// ===== BACK TO TOP =====
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SMOOTH HOVER PARALLAX on hero =====
document.addEventListener('mousemove', e => {
  const wrapper = document.querySelector('.hero-avatar-wrapper');
  if (!wrapper) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  wrapper.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
});

// ===== HAMBURGER ANIMATION =====
hamburger.addEventListener('click', () => {
  const spans = hamburger.querySelectorAll('span');
  if (hamburger.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// ===== FADE IN UP KEYFRAME =====
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
  from { opacity:0; transform:translateY(30px); }
  to   { opacity:1; transform:translateY(0); }
}
`;
document.head.appendChild(style);

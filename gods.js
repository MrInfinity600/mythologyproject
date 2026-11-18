const stage = document.getElementById('stage');
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('dotsContainer');
const progressFill = document.getElementById('progressFill');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const railCurrent = document.getElementById('railCurrent');
const railTotal = document.getElementById('railTotal');

let currentIndex = 0;
railTotal.textContent = String(slides.length).padStart(2, '0');

// 1. Build Navigation Dots with Hover Tooltips
slides.forEach((slide, index) => {
  const dot = document.createElement('button');
  dot.classList.add('dot');
  dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
  dot.setAttribute('data-tooltip', slide.dataset.title || `Slide ${index + 1}`);
  if (index === 0) dot.classList.add('active');

  dot.addEventListener('click', () => goToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

// 2. Sync UI State (Dots, Progress Bar, Side Counter, Past/Active Classes)
function updateUI(activeIndex) {
  currentIndex = activeIndex;

  slides.forEach((slide, index) => {
    slide.classList.remove('active', 'past');
    if (index === currentIndex) {
      slide.classList.add('active');
    } else if (index < currentIndex) {
      slide.classList.add('past');
    }
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });

  const progressPercent = (currentIndex / (slides.length - 1)) * 100;
  progressFill.style.width = `${progressPercent}%`;
  railCurrent.textContent = String(currentIndex + 1).padStart(2, '0');

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === slides.length - 1;
}

// 3. Smooth Scroll-to-Slide Function (Works seamlessly with native scrolling)
function goToSlide(index) {
  if (index < 0 || index >= slides.length) return;
  slides[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
}

prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

// 4. IntersectionObserver: Automatically triggers In & Out transitions on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = Array.from(slides).indexOf(entry.target);
        updateUI(index);
      }
    });
  },
  {
    root: stage,
    threshold: 0.55 // Triggers when 55% of a slide enters viewport
  }
);

slides.forEach((slide) => observer.observe(slide));

// 5. Keyboard Navigation (Arrow Keys & Spacebar)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault();
    goToSlide(currentIndex + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    goToSlide(currentIndex - 1);
  }
});

// 6. Interactive 3D Card Tilt & Radial Spotlight
document.querySelectorAll('.tilt-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update CSS spotlight coordinates
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // Calculate subtle 3D rotation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// 7. Magnetic Button Pull Effect
document.querySelectorAll('.magnetic').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

// 8. Ambient Canvas Particle System (Ares Crimson Embers + Athena Gold Motes)
const canvas = document.getElementById('ambientCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.2 + 0.6;
    this.speedY = -(Math.random() * 0.45 + 0.15);
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.isAres = Math.random() > 0.5;
    this.alpha = Math.random() * 0.45 + 0.1;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    if (this.y < -10) {
      this.y = canvas.height + 10;
      this.x = Math.random() * canvas.width;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.isAres
      ? `rgba(248, 113, 113, ${this.alpha})`
      : `rgba(251, 191, 36, ${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 55; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

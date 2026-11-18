const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('dotsContainer');
const progressFill = document.getElementById('progressFill');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
let isAnimating = false;

// Create navigation dots dynamically
slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.classList.add('dot');
  dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function updatePresentation() {
  slides.forEach((slide, index) => {
    slide.classList.remove('active', 'past');
    
    if (index === currentIndex) {
      slide.classList.add('active');
    } else if (index < currentIndex) {
      slide.classList.add('past');
    }
  });

  // Update dots
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });

  // Update top progress bar
  const progressPercent = (currentIndex / (slides.length - 1)) * 100;
  progressFill.style.width = `${progressPercent}%`;

  // Update button states
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === slides.length - 1;
}

function goToSlide(index) {
  if (isAnimating || index === currentIndex || index < 0 || index >= slides.length) return;
  
  isAnimating = true;
  currentIndex = index;
  updatePresentation();

  // Prevent spam clicking during transition
  setTimeout(() => {
    isAnimating = false;
  }, 650);
}

function nextSlide() {
  goToSlide(currentIndex + 1);
}

function prevSlide() {
  goToSlide(currentIndex - 1);
}

// Keyboard navigation (Arrow keys & Spacebar)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    prevSlide();
  }
});

// Initialize on load
updatePresentation();
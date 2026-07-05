// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
revealEls.forEach(el=> io.observe(el));

// Active nav dot on scroll
const sections = ['about','experience','projects','skills','education'].map(id=>document.getElementById(id));
const links = document.querySelectorAll('.rail a');
const navIO = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const id = entry.target.id;
      links.forEach(l=>{
        l.classList.toggle('active', l.getAttribute('href') === '#'+id);
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s=> s && navIO.observe(s));

// ---------- Project gallery data ----------
// Replace the "images" arrays below with your own photo paths
// (e.g. "images/capstone-1.jpg") once you have real screenshots.
function placeholderImg(label, colorIdx){
  const colors = ['#6D8196', '#8FA3B0', '#566878', '#4A4A4A'];
  const bg = colors[colorIdx % colors.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>
    <rect width='100%' height='100%' fill='${bg}'/>
    <text x='50%' y='50%' font-family='monospace' font-size='22' fill='#FFFFE3' text-anchor='middle' dominant-baseline='middle'>${label}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const projects = [
  {
    type: 'Capstone Project',
    title: 'AIMS: Avera Information Monitoring System for Construction Progress Tracking',
    desc: 'AIMS is a construction project monitoring system that helps teams track project progress, manage expenses, and organize project records through a centralized web platform with real-time updates.',
    tools: ['Python', 'Django', 'HTML', 'Tailwind CSS', 'JavaScript', 'PostgreSQL'],
    images: [
      "assets/login.png",
      "assets/dashboard.png",
      "assets/project.png",
      "assets/boq.png",
    ]
  },
  {
    type: 'Internship Project - Eversoft IT Solutions ',
    title: 'Pharmacy POS System - Multi-Branch Point-of-Sale & Inventory Platform',
    desc: 'Developed and maintained a full-stack Point of Sale (POS) system during my internship, contributing to transaction processing, inventory management, bug fixes, multi-branch deployment, and continuous system improvements.',
     tools: ['Python', 'Django', 'Bootstrap', 'JavaScript', 'PostgreSQL'],
    images: [
      "assets/pos-login.jpg",
      "assets/pos.jpg",
      "assets/add.jpg",
      "assets/checkout.jpg",

    ]
  },
  {
    type: 'Database Design',
    title: 'Clinic Records Database',
    desc: "A normalized database schema and query set for a mock clinic's patient records, designed for our database management course with an ER diagram and sample reports.",
    tools: ['SQL', 'ER Diagrams', 'Normalization'],
    images: [
      placeholderImg('ER Diagram', 2),
      placeholderImg('Sample Query Output', 3),
      placeholderImg('Report Layout', 0)
    ]
  },
  {
    type: 'Web Development',
    title: 'Barangay Info Portal',
    desc: 'A static information site built to practice semantic HTML, CSS layout, and basic JavaScript interactivity for our intro web development class.',
    tools: ['HTML/CSS', 'JavaScript', 'Responsive Design'],
    images: [
      placeholderImg('Homepage', 3),
      placeholderImg('Mobile View', 1),
      placeholderImg('Contact Page', 2)
    ]
  }
];

// ---------- Modal logic ----------
const modal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalType = document.getElementById('modalType');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTools = document.getElementById('modalTools');
const galleryImage = document.getElementById('galleryImage');
const galleryCounter = document.getElementById('galleryCounter');
const galleryThumbs = document.getElementById('galleryThumbs');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');

let currentProject = null;
let currentIndex = 0;
let lastFocusedEl = null;

function renderSlide(){
  const proj = projects[currentProject];
  galleryImage.src = proj.images[currentIndex];
  galleryImage.alt = proj.title + ' — photo ' + (currentIndex + 1);
  galleryCounter.textContent = (currentIndex + 1) + ' / ' + proj.images.length;
  [...galleryThumbs.children].forEach((thumb, i)=>{
    thumb.classList.toggle('active', i === currentIndex);
  });
}

function openModal(projectIdx){
  currentProject = projectIdx;
  currentIndex = 0;
  const proj = projects[projectIdx];

  modalType.textContent = proj.type;
  modalTitle.textContent = proj.title;
  modalDesc.textContent = proj.desc;
  modalTools.innerHTML = proj.tools.map(t => `<span class="chip">${t}</span>`).join('');

  galleryThumbs.innerHTML = proj.images.map((src, i) =>
    `<img src="${src}" alt="Thumbnail ${i+1}" data-idx="${i}">`
  ).join('');
  [...galleryThumbs.children].forEach(thumb=>{
    thumb.addEventListener('click', ()=>{
      currentIndex = parseInt(thumb.dataset.idx, 10);
      renderSlide();
    });
  });

  renderSlide();

  lastFocusedEl = document.activeElement;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if(lastFocusedEl) lastFocusedEl.focus();
}

function showPrev(){
  const proj = projects[currentProject];
  currentIndex = (currentIndex - 1 + proj.images.length) % proj.images.length;
  renderSlide();
}
function showNext(){
  const proj = projects[currentProject];
  currentIndex = (currentIndex + 1) % proj.images.length;
  renderSlide();
}

document.querySelectorAll('.proj-card').forEach(card=>{
  const idx = parseInt(card.dataset.project, 10);
  card.addEventListener('click', ()=> openModal(idx));
  card.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      openModal(idx);
    }
  });
});

modalClose.addEventListener('click', closeModal);
galleryPrev.addEventListener('click', showPrev);
galleryNext.addEventListener('click', showNext);

modal.addEventListener('click', (e)=>{
  if(e.target === modal) closeModal();
});

document.addEventListener('keydown', (e)=>{
  if(!modal.classList.contains('open')) return;
  if(e.key === 'Escape') closeModal();
  if(e.key === 'ArrowLeft') showPrev();
  if(e.key === 'ArrowRight') showNext();
});

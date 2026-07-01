// ============ Language State ============
let currentLang = localStorage.getItem('lang') === 'fr' ? 'fr' : 'en';

// ============ Preloader ============
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader.classList.add('hidden'), 400);
});

// ============ Footer Year ============
document.getElementById('year').textContent = new Date().getFullYear();

// ============ Custom Cursor ============
const cursorDot = document.getElementById('cursorDot');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .gallery-item').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('grow'));
  });
}

// ============ Mobile Nav ============
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ============ Header Scroll State ============
const siteHeader = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 40);
});

// ============ Active Nav Link on Scroll ============
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const setActiveLink = () => {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinkEls.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', setActiveLink);

// ============ Gallery Data ============
const galleryData = [
  { id: 1013, title: { en: 'Golden Hour Portrait', fr: "Portrait à l'Heure Dorée" }, category: 'portrait', size: 'tall' },
  { id: 1015, title: { en: 'Mountain Silence', fr: 'Silence des Montagnes' }, category: 'landscape', size: '' },
  { id: 1027, title: { en: 'Downtown Passersby', fr: 'Passants du Centre-Ville' }, category: 'street', size: '' },
  { id: 1025, title: { en: 'Study in Grey', fr: 'Étude en Gris' }, category: 'bw', size: 'wide' },
  { id: 1005, title: { en: 'Quiet Gaze', fr: 'Regard Silencieux' }, category: 'portrait', size: '' },
  { id: 1043, title: { en: 'Fields at Dusk', fr: 'Champs au Crépuscule' }, category: 'landscape', size: 'tall' },
  { id: 1050, title: { en: 'Crosswalk Motion', fr: 'Mouvement au Passage Piéton' }, category: 'street', size: '' },
  { id: 1074, title: { en: 'Winter Light', fr: "Lumière d'Hiver" }, category: 'bw', size: '' },
  { id: 1062, title: { en: 'Coastal Morning', fr: 'Matin Côtier' }, category: 'landscape', size: 'wide' },
  { id: 1080, title: { en: 'Candid Frame', fr: 'Instantané Naturel' }, category: 'portrait', size: '' },
  { id: 1084, title: { en: 'Alleyway', fr: 'Ruelle' }, category: 'street', size: '' },
  { id: 1069, title: { en: 'Monochrome Portrait', fr: 'Portrait Monochrome' }, category: 'bw', size: '' },
];

const categoryLabels = {
  en: { all: 'All', portrait: 'Portrait', landscape: 'Landscape', street: 'Street', bw: 'Black & White' },
  fr: { all: 'Tous', portrait: 'Portrait', landscape: 'Paysage', street: 'Rue', bw: 'Noir et Blanc' },
};

const galleryGrid = document.getElementById('galleryGrid');

const renderGallery = () => {
  galleryGrid.innerHTML = galleryData.map((item, i) => `
    <div class="gallery-item ${item.size}" data-category="${item.category}" data-index="${i}">
      <img src="https://picsum.photos/id/${item.id}/700/900" alt="${item.title[currentLang]}" loading="lazy">
      <div class="gallery-overlay">
        <span>${categoryLabels[currentLang][item.category]}</span>
        <h3>${item.title[currentLang]}</h3>
      </div>
    </div>
  `).join('');
};
renderGallery();

// Reveal gallery items on load
requestAnimationFrame(() => {
  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    setTimeout(() => item.classList.add('visible'), i * 60);
  });
});

// ============ Gallery Filtering ============
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    document.querySelectorAll('.gallery-item').forEach((item) => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
      if (match) {
        requestAnimationFrame(() => item.classList.add('visible'));
      }
    });
  });
});

// ============ Lightbox ============
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentIndex = 0;

const getVisibleIndexes = () =>
  Array.from(document.querySelectorAll('.gallery-item:not(.hidden)')).map((el) => Number(el.dataset.index));

const openLightbox = (index) => {
  currentIndex = index;
  const item = galleryData[index];
  lightboxImg.src = `https://picsum.photos/id/${item.id}/1400/1000`;
  lightboxImg.alt = item.title[currentLang];
  lightboxCaption.textContent = `${item.title[currentLang]} - ${categoryLabels[currentLang][item.category]}`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
};

const showAdjacent = (direction) => {
  const visible = getVisibleIndexes();
  const pos = visible.indexOf(currentIndex);
  const nextPos = (pos + direction + visible.length) % visible.length;
  openLightbox(visible[nextPos]);
};

galleryGrid.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (!item) return;
  openLightbox(Number(item.dataset.index));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => showAdjacent(-1));
lightboxNext.addEventListener('click', () => showAdjacent(1));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showAdjacent(-1);
  if (e.key === 'ArrowRight') showAdjacent(1);
});

// ============ Scroll Reveal (About stats, skills, sections) ============
const revealTargets = document.querySelectorAll('.about-content, .about-image, .section-heading, .contact-wrap');
revealTargets.forEach((el) => el.classList.add('reveal'));

const skillFills = document.querySelectorAll('.skill-fill');
const statNumbers = document.querySelectorAll('.stat h3');
let statsAnimated = false;

const animateStats = () => {
  if (statsAnimated) return;
  statsAnimated = true;
  statNumbers.forEach((el) => {
    const target = Number(el.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const tick = () => {
      current += step;
      if (current >= target) {
        el.textContent = target;
      } else {
        el.textContent = current;
        requestAnimationFrame(tick);
      }
    };
    tick();
  });
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('about-content')) {
        skillFills.forEach((fill) => {
          fill.style.width = fill.dataset.width + '%';
        });
        animateStats();
      }
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealTargets.forEach((el) => observer.observe(el));

// ============ Contact Form Validation ============
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

const validators = {
  name: (v) => v.trim().length > 1,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  subject: (v) => v.trim().length > 1,
  message: (v) => v.trim().length > 5,
};

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;

  Object.keys(validators).forEach((field) => {
    const input = contactForm.elements[field];
    const group = input.closest('.form-group');
    const valid = validators[field](input.value);
    group.classList.toggle('error', !valid);
    if (!valid) isValid = false;
  });

  if (isValid) {
    formSuccess.classList.add('show');
    contactForm.reset();
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  } else {
    formSuccess.classList.remove('show');
  }
});

Object.keys(validators).forEach((field) => {
  const input = contactForm.elements[field];
  input.addEventListener('input', () => {
    const group = input.closest('.form-group');
    if (validators[field](input.value)) {
      group.classList.remove('error');
    }
  });
});

// ============ Translations ============
const translations = {
  en: {
    navHome: 'Home',
    navGallery: 'Gallery',
    navAbout: 'About',
    navContact: 'Contact',
    heroEyebrow: 'Photography Student - Portfolio 2026',
    heroTitleLine1: 'Seeing light,',
    heroTitleLine2: 'telling stories.',
    heroSub: 'Portrait & documentary photography exploring quiet moments and natural light.',
    heroBtn: 'View Gallery',
    gallerySectionTag: 'Selected Work',
    gallerySectionTitle: 'Gallery',
    filterAll: 'All',
    filterPortrait: 'Portrait',
    filterLandscape: 'Landscape',
    filterStreet: 'Street',
    filterBw: 'Black & White',
    aboutTag: 'About Me',
    aboutTitle: "Hi, I'm Ava.",
    aboutText1: "I'm a third-year photography student focused on portrait and documentary work. My practice centers on natural light, honest expressions, and the in-between moments that usually go unnoticed. I'm currently building my technical range across film and digital while developing a personal visual language rooted in stillness and quiet observation.",
    aboutText2: "When I'm not shooting, I'm assisting on local shoots, printing in the darkroom, or scouting new locations around the city.",
    skill1: 'Portrait Photography',
    skill2: 'Photo Editing (Lightroom / Photoshop)',
    skill3: 'Film Development',
    skill4: 'Studio Lighting',
    stat1: 'Shoots Completed',
    stat2: 'Exhibitions',
    stat3: 'Years Shooting',
    contactTag: 'Get In Touch',
    contactTitle: "Let's Work Together",
    labelName: 'Name',
    labelEmail: 'Email',
    labelSubject: 'Subject',
    labelMessage: 'Message',
    errorName: 'Please enter your name',
    errorEmail: 'Please enter a valid email',
    errorSubject: 'Please enter a subject',
    errorMessage: 'Please enter a message',
    btnSend: 'Send Message',
    formSuccess: 'Thanks! Your message has been sent.',
    infoEmail: 'Email',
    infoLocation: 'Location',
    infoFollow: 'Follow',
    footerRights: 'All rights reserved.',
    backToTop: 'Back to top ↑',
    langToggle: 'FR',
  },
  fr: {
    navHome: 'Accueil',
    navGallery: 'Galerie',
    navAbout: 'À Propos',
    navContact: 'Contact',
    heroEyebrow: 'Étudiante en Photographie - Portfolio 2026',
    heroTitleLine1: 'Voir la lumière,',
    heroTitleLine2: 'raconter des histoires.',
    heroSub: 'Photographie de portrait et documentaire explorant les moments calmes et la lumière naturelle.',
    heroBtn: 'Voir la Galerie',
    gallerySectionTag: 'Travaux Sélectionnés',
    gallerySectionTitle: 'Galerie',
    filterAll: 'Tous',
    filterPortrait: 'Portrait',
    filterLandscape: 'Paysage',
    filterStreet: 'Rue',
    filterBw: 'Noir et Blanc',
    aboutTag: 'À Propos de Moi',
    aboutTitle: 'Bonjour, je suis Ava.',
    aboutText1: "Je suis étudiante en photographie de troisième année, spécialisée dans le portrait et le documentaire. Ma pratique est centrée sur la lumière naturelle, les expressions sincères et les moments intermédiaires qui passent souvent inaperçus. Je développe actuellement mes compétences techniques entre l'argentique et le numérique, tout en construisant un langage visuel personnel ancré dans le calme et l'observation.",
    aboutText2: "Quand je ne suis pas en séance photo, j'assiste sur des tournages locaux, je développe des tirages en chambre noire, ou je repère de nouveaux lieux dans la ville.",
    skill1: 'Photographie de Portrait',
    skill2: 'Retouche Photo (Lightroom / Photoshop)',
    skill3: 'Développement de Pellicule',
    skill4: 'Éclairage de Studio',
    stat1: 'Séances Réalisées',
    stat2: 'Expositions',
    stat3: 'Années de Pratique',
    contactTag: 'Contactez-Moi',
    contactTitle: 'Travaillons Ensemble',
    labelName: 'Nom',
    labelEmail: 'E-mail',
    labelSubject: 'Sujet',
    labelMessage: 'Message',
    errorName: 'Veuillez entrer votre nom',
    errorEmail: 'Veuillez entrer un e-mail valide',
    errorSubject: 'Veuillez entrer un sujet',
    errorMessage: 'Veuillez entrer un message',
    btnSend: 'Envoyer le Message',
    formSuccess: 'Merci ! Votre message a été envoyé.',
    infoEmail: 'E-mail',
    infoLocation: 'Localisation',
    infoFollow: 'Suivre',
    footerRights: 'Tous droits réservés.',
    backToTop: 'Retour en haut ↑',
    langToggle: 'EN',
  },
};

const langToggleBtn = document.getElementById('langToggle');

const applyLanguage = (lang) => {
  currentLang = lang;
  document.documentElement.lang = lang;
  const dict = translations[lang];

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  langToggleBtn.textContent = dict.langToggle;

  renderGallery();
  document.querySelectorAll('.gallery-item').forEach((item) => item.classList.add('visible'));

  const activeFilterBtn = document.querySelector('.filter-btn.active');
  if (activeFilterBtn && activeFilterBtn.dataset.filter !== 'all') {
    document.querySelectorAll('.gallery-item').forEach((item) => {
      item.classList.toggle('hidden', item.dataset.category !== activeFilterBtn.dataset.filter);
    });
  }

  localStorage.setItem('lang', lang);
};

langToggleBtn.addEventListener('click', () => {
  applyLanguage(currentLang === 'en' ? 'fr' : 'en');
});

if (currentLang === 'fr') {
  applyLanguage('fr');
}

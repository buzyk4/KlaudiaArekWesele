// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click', (e)=>{
    const target = document.querySelector(link.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

// Personalize invitation
const greeting = document.getElementById('greeting');
const tag = document.getElementById('tag');

// Modal elements
const modal = document.getElementById('name-modal');
const modalInput = document.getElementById('modal-name');
const submitBtn = document.getElementById('submit-name');
const errorEl = document.getElementById('error');
const mainContent = document.getElementById('main-content');

// Show modal on load, hide main content
window.addEventListener('load', () => {
  modal.classList.remove('hidden');
  mainContent.classList.add('hidden');
});

// Function to find guest - either as main guest or as a partner
function findGuest(name) {
  // Check if name is a main guest
  if (guests[name]) {
    return {
      mainName: name,
      mainGuest: guests[name],
      isPartner: false
    };
  }
  
  // Check if name is a partner
  for (const [guestName, guestData] of Object.entries(guests)) {
    if (guestData.partner && guestData.partner.trim() === name.trim()) {
      // Found as partner - swap them
      return {
        mainName: name,
        mainGuest: {
          gender: guestData.partnerGender,
          partner: guestName,
          partnerGender: guestData.gender,
          vocative: guestData.partnerVocative,
          lastName: guestData.partnerLastName,
          partnerVocative: guestData.vocative,
          partnerLastName: guestData.lastName,
          sharedLastName: guestData.sharedLastName,
          pluralLastName: guestData.pluralLastName
        },
        isPartner: true
      };
    }
  }
  
  return null;
}

// Handle modal submit
submitBtn.addEventListener('click', () => {
  const enteredName = modalInput.value.trim();
  const guestData = findGuest(enteredName);
  if (guestData) {
    // Ustaw motyw kolorystyczny na podstawie płci
    const theme = guestData.mainGuest.gender === 'female' ? 'theme-female' : 'theme-male';
    document.body.className = theme;
    
    // Ukryj formularz z animacją
    modal.classList.add('hidden');
    
    // Pokaż stronę z opóźnieniem dla płynności animacji
    setTimeout(() => {
      mainContent.classList.remove('hidden');
      updateGreeting(guestData.mainName, guestData.mainGuest);
      // Przewiń do samej góry strony
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  } else {
    errorEl.style.display = 'block';
  }
});

// Obsługa Enter w polu input
modalInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    submitBtn.click();
  }
});

// Update greeting function
function updateGreeting(name, guest) {
  if (name && guest) {
    const hasPartner = guest.partner && guest.partner.trim() !== '';
    
    // Generowanie tekstu w zależności od płci i obecności partnera
    let greetingText = '';
    let invitationText = '';
    
    if (hasPartner) {
      // Sprawdź czy mają wspólne nazwisko (nawet w różnych formach)
      if (guest.sharedLastName && guest.pluralLastName) {
        // Używamy wołacza i nazwisko w formie mnogiej/wołaczu na końcu
        const pluralSalutation = 'Drodzy'; // "Drodzy" działa dla par
        greetingText = `${pluralSalutation} ${guest.vocative} i ${guest.partnerVocative} ${guest.pluralLastName}!`;
      } else {
        // Różne nazwiska - tylko imiona w wołaczu
        greetingText = `Drodzy ${guest.vocative} i ${guest.partnerVocative}!`;
      }
      
      invitationText = `Z wielką radością zapraszamy Was na nasze wesele. Uroczystość odbędzie się 23 maja 2026 o godzinie 16:00 w Janiowym Wzgórzu. Nie możemy się doczekać świętowania razem z Wami! ❤️`;
    } else {
      // Forma dla osoby z osobą towarzyszącą (nieokreśloną)
      const salutation = guest.gender === 'female' ? 'Droga' : 'Drogi';
      const vocativeName = guest.vocative ? `${guest.vocative} ${guest.lastName}` : name;
      greetingText = `${salutation} ${vocativeName}!`;
      invitationText = `Z wielką radością zapraszamy Cię wraz z osobą towarzyszącą na nasze wesele. Uroczystość odbędzie się 23 maja 2026 o godzinie 16:00 w Janiowym Wzgórzu. Nie możemy się doczekać świętowania razem z Wami! ❤️`;
    }
    
    greeting.textContent = greetingText;
    tag.textContent = invitationText;
  } else {
    greeting.textContent = 'Klaudia & Arek';
    tag.textContent = 'Z wielką radością zapraszamy na nasze wesele. Uroczystość odbędzie się 23 maja 2026 o godzinie 16:00 w Janiowym Wzgórzu. ❤️';
  }
}

// Image modal functionality with navigation
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.getElementById('close-modal');
const prevBtn = document.getElementById('prev-image');
const nextBtn = document.getElementById('next-image');
const inspirationImages = Array.from(document.querySelectorAll('.inspiracje img'));
let currentImageIndex = 0;

function showImage(index) {
  if (!inspirationImages.length) return;
  currentImageIndex = (index + inspirationImages.length) % inspirationImages.length;
  const img = inspirationImages[currentImageIndex];
  modalImage.src = img.src;
  modalImage.alt = img.alt || 'Podgląd';
  imageModal.classList.remove('hidden');
}

inspirationImages.forEach((img, idx) => {
  img.addEventListener('click', () => showImage(idx));
});

const hideModal = () => imageModal.classList.add('hidden');

closeModal.addEventListener('click', hideModal);

imageModal.addEventListener('click', (e) => {
  if (e.target === imageModal) hideModal();
});

prevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  showImage(currentImageIndex - 1);
});

nextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  showImage(currentImageIndex + 1);
});

window.addEventListener('keydown', (e) => {
  if (imageModal.classList.contains('hidden')) return;
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    showImage(currentImageIndex - 1);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    showImage(currentImageIndex + 1);
  } else if (e.key === 'Escape') {
    hideModal();
  }
});

// Scroll reveal animation
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, observerOptions);

// Obserwuj wszystkie sekcje (oprócz hero, która jest zawsze widoczna)
window.addEventListener('load', () => {
  const sections = document.querySelectorAll('.details-section, .inspiracje, .contact-section, .scroll-reveal');
  sections.forEach(section => {
    section.classList.add('scroll-reveal');
    scrollObserver.observe(section);
  });
});

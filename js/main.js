// Menú móvil
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    });
  });
}

// Año en el footer
const anioEl = document.getElementById('anio');
if (anioEl) anioEl.textContent = new Date().getFullYear();

// Navegación activa al hacer scroll
const sections = document.querySelectorAll('section[id], .blog-hero, .blog-section');
const navLinks = document.querySelectorAll('.nav-link');

const esHome = !!document.getElementById('inicio');

if (esHome) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = window.scrollY;
      const offset = section.offsetTop - 120;
      if (top >= offset) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

// Función para mostrar foto de reemplazo si no existe la imagen
function mostrarFotoReemplazo(img) {
  const marco = img.closest('.foto-marco') || img.parentElement;
  const iniciales = document.createElement('div');
  iniciales.className = 'foto-placeholder';
  iniciales.style.cssText = `
    width: 100%;
    height: 100%;
    aspect-ratio: 4/5;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0e7490, #22b8cf);
    color: #fff;
    font-size: 4rem;
    font-family: 'Merriweather', serif;
    font-weight: 700;
  `;
  iniciales.textContent = 'HP';
  if (marco) {
    const credito = marco.querySelector('.foto-credito');
    if (credito) credito.style.display = 'none';
  }
  img.replaceWith(iniciales);
}

// Formulario de cita
const citaForm = document.getElementById('citaForm');
if (citaForm) {
  citaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formOk = document.createElement('div');
    formOk.className = 'form-ok';
    formOk.style.display = 'block';
    formOk.textContent = '✅ ¡Gracias! Hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto para confirmar tu cita.';
    citaForm.prepend(formOk);
    citaForm.reset();
    setTimeout(() => { formOk.remove(); }, 6000);
  });
}

// Formulario newsletter
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    const btn = newsletterForm.querySelector('button');
    const original = btn.textContent;
    btn.textContent = '✅ Suscrito';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      newsletterForm.reset();
    }, 3000);
  });
}

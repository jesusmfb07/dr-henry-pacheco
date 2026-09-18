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

// Formulario de cita → envía la solicitud por WhatsApp
const citaForm = document.getElementById('citaForm');
if (citaForm) {
  citaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const sede = document.getElementById('sede').value.trim();
    const motivo = document.getElementById('motivo').value.trim();

    const opcionesSede = {
      delgado: 'Clínica Delgado',
      sanborja: 'Sanna San Borja',
      golf: 'Sanna El Golf',
      internacional: 'Clínica Internacional'
    };

    const mensaje =
      'Hola Dr. Henry Pacheco, quiero agendar una cita médica.%0A' +
      'Nombre: ' + encodeURIComponent(nombre) + '%0A' +
      'Teléfono: ' + encodeURIComponent(telefono) +
      (correo ? '%0ACorreo: ' + encodeURIComponent(correo) : '') +
      '%0ASede de preferencia: ' + encodeURIComponent(opcionesSede[sede] || sede) +
      (motivo ? '%0AMotivo: ' + encodeURIComponent(motivo) : '');

    window.open('https://wa.me/51974639760?text=' + mensaje, '_blank');
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
    btn.textContent = 'Suscrito';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      newsletterForm.reset();
    }, 3000);
  });
}

// Formulario de testimonio: revisión previa por WhatsApp
const testimonioModal = document.getElementById('testimonioModal');
const testimonioForm = document.getElementById('testimonioForm');
const abrirTestimonio = document.querySelector('[data-open-testimonio]');
const cerrarTestimonio = document.querySelectorAll('[data-close-testimonio]');

if (testimonioModal && testimonioForm && abrirTestimonio) {
  const abrirModal = () => {
    testimonioModal.hidden = false;
    testimonioModal.classList.add('is-open');
    document.body.classList.add('modal-open');
    document.getElementById('testimonioNombre').focus();
  };

  const cerrarModal = () => {
    testimonioModal.classList.remove('is-open');
    testimonioModal.hidden = true;
    document.body.classList.remove('modal-open');
    abrirTestimonio.focus();
  };

  abrirTestimonio.addEventListener('click', abrirModal);
  cerrarTestimonio.forEach(elemento => elemento.addEventListener('click', cerrarModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && testimonioModal.classList.contains('is-open')) cerrarModal();
  });

  testimonioForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('testimonioNombre').value.trim();
    const relacion = document.getElementById('testimonioRelacion').value;
    const calificacion = document.getElementById('testimonioCalificacion').value;
    const experiencia = document.getElementById('testimonioTexto').value.trim();
    const estrellas = '★'.repeat(Number(calificacion));
    const mensaje = [
      'Hola, quiero compartir mi experiencia con el Dr. Henry Pacheco para su revisión.',
      '',
      'Nombre o iniciales: ' + nombre,
      'Atención recibida por: ' + relacion,
      'Calificación: ' + estrellas + ' (' + calificacion + '/5)',
      'Experiencia: ' + experiencia,
      '',
      'Autorizo la revisión y eventual publicación de este comentario.'
    ].join('\n');

    window.open('https://wa.me/51974639760?text=' + encodeURIComponent(mensaje), '_blank', 'noopener');
  });
}

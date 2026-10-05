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

// Estadísticas del hero: crecimiento diario y animación al cargar
const counters = document.querySelectorAll('[data-counter-base]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const limaDate = Object.fromEntries(
  new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).formatToParts(new Date()).map(part => [part.type, part.value])
);
const todayUtc = Date.UTC(Number(limaDate.year), Number(limaDate.month) - 1, Number(limaDate.day));

counters.forEach(counter => {
  const base = Number(counter.dataset.counterBase);
  const daily = Number(counter.dataset.counterDaily);
  const [year, month, day] = counter.dataset.counterStart.split('-').map(Number);
  const startUtc = Date.UTC(year, month - 1, day);
  const elapsedDays = Math.max(0, Math.floor((todayUtc - startUtc) / 86400000));
  const target = base + (elapsedDays * daily);

  if (reduceMotion) {
    counter.textContent = `${target}+`;
    return;
  }

  const duration = 1400;
  const startedAt = performance.now();

  const animate = currentTime => {
    const progress = Math.min((currentTime - startedAt) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    counter.textContent = `${Math.round(target * easedProgress)}+`;

    if (progress < 1) requestAnimationFrame(animate);
  };

  counter.textContent = '0+';
  requestAnimationFrame(animate);
});

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

// Formulario de experiencia: envío por correo y publicación en este navegador
const experienciaForm = document.getElementById('experienciaForm');
if (experienciaForm) {
  const testimoniosList = document.getElementById('testimoniosList');
  const storageKey = 'drHenryTestimonios';
  const adminMode = new URLSearchParams(window.location.search).get('admin') === '1';
  let testimoniosGuardados = [];

  const guardarTestimonios = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(testimoniosGuardados));
    } catch (error) {
      // El sitio sigue funcionando aunque el navegador bloquee localStorage.
    }
  };

  const crearTestimonio = ({ id, nombre, relacion, calificacion, experiencia }) => {
    const article = document.createElement('article');
    const stars = document.createElement('div');
    const text = document.createElement('p');
    const author = document.createElement('div');
    const authorName = document.createElement('strong');
    const detail = document.createElement('span');
    const rating = Math.min(5, Math.max(1, Number.parseInt(calificacion, 10) || 1));

    article.className = 'testimonio';
    stars.className = 'stars';
    stars.setAttribute('role', 'img');
    stars.setAttribute('aria-label', `${rating} de 5 estrellas`);
    stars.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    text.className = 'texto';
    text.textContent = `“${experiencia}”`;
    author.className = 'autor';
    authorName.textContent = nombre;
    detail.textContent = `${relacion} · Experiencia enviada`;
    author.append(authorName, detail);
    article.append(stars, text, author);

    if (adminMode) {
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'testimonio-delete';
      deleteButton.textContent = 'Eliminar comentario';
      deleteButton.addEventListener('click', () => {
        if (!window.confirm(`¿Eliminar el comentario de ${nombre}?`)) return;

        testimoniosGuardados = testimoniosGuardados.filter(testimonio => testimonio.id !== id);
        guardarTestimonios();
        article.remove();
      });
      article.append(deleteButton);
    }

    return article;
  };

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) {
      testimoniosGuardados = saved.map((testimonio, index) => ({
        ...testimonio,
        id: testimonio.id || `guardado-${Date.now()}-${index}`
      }));
      guardarTestimonios();
    }
  } catch (error) {
    // Algunos modos privados bloquean por completo el acceso a localStorage.
  }

  if (adminMode) {
    const adminNotice = document.createElement('p');
    adminNotice.className = 'testimonios-admin-notice';
    adminNotice.textContent = 'Modo administrador: puedes eliminar los comentarios enviados desde este navegador.';
    testimoniosList.before(adminNotice);
  }

  testimoniosGuardados.forEach(testimonio => {
    testimoniosList.prepend(crearTestimonio(testimonio));
  });

  experienciaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = experienciaForm.querySelector('button[type="submit"]');
    const status = document.getElementById('experienciaStatus');
    const original = button.textContent;
    const testimonio = {
      id: `testimonio-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      nombre: document.getElementById('experienciaNombre').value.trim(),
      relacion: document.getElementById('experienciaRelacion').value,
      calificacion: document.getElementById('experienciaCalificacion').value,
      experiencia: document.getElementById('experienciaTexto').value.trim()
    };
    const correo = document.getElementById('experienciaCorreo').value.trim();
    const formData = new FormData(experienciaForm);
    formData.set('_subject', `Nuevo mensaje de ${testimonio.nombre}`);
    if (correo) formData.set('_replyto', correo);

    button.disabled = true;
    button.textContent = 'Enviando...';
    status.className = 'form-status';

    try {
      const response = await fetch('https://formsubmit.co/ajax/henry.pacheco.md@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });
      if (!response.ok) throw new Error('No se pudo enviar');

      testimoniosGuardados.push(testimonio);
      guardarTestimonios();
      testimoniosList.prepend(crearTestimonio(testimonio));
      experienciaForm.reset();
      status.textContent = 'Gracias. Tu experiencia fue enviada y añadida correctamente.';
      status.classList.add('is-success');
    } catch (error) {
      status.textContent = 'No pudimos enviar tu experiencia en este momento. Inténtalo nuevamente más tarde.';
      status.classList.add('is-error');
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  });
}

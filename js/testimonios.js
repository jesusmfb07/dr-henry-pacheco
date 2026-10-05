import { firebaseApp } from './firebase-config.js';
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const db = getFirestore(firebaseApp);
const testimoniosRef = collection(db, 'testimonios');

function crearTestimonio({ nombre, relacion, calificacion, experiencia }) {
  const article = document.createElement('article');
  const stars = document.createElement('div');
  const text = document.createElement('p');
  const author = document.createElement('div');
  const authorName = document.createElement('strong');
  const detail = document.createElement('span');
  const rating = Math.min(5, Math.max(1, Number.parseInt(calificacion, 10) || 1));

  article.className = 'testimonio testimonio-firebase';
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

  return article;
}

function mostrarTestimonios(contenedor, documentos) {
  contenedor.querySelectorAll('.testimonio-firebase').forEach(element => element.remove());
  const fragment = document.createDocumentFragment();
  documentos.forEach(documento => fragment.append(crearTestimonio(documento.data())));
  contenedor.prepend(fragment);
}

async function migrarTestimoniosLocales() {
  try {
    const guardados = JSON.parse(localStorage.getItem('drHenryTestimonios') || '[]');
    if (!Array.isArray(guardados) || guardados.length === 0) return;

    const relacionesValidas = ['Yo fui el paciente', 'Un familiar', 'Otra persona cercana'];
    const testimoniosValidos = guardados.filter(testimonio =>
      typeof testimonio.nombre === 'string'
      && testimonio.nombre.trim().length >= 1
      && relacionesValidas.includes(testimonio.relacion)
      && typeof testimonio.experiencia === 'string'
      && testimonio.experiencia.trim().length >= 20
    );
    if (testimoniosValidos.length === 0 || testimoniosValidos.length > 500) return;

    const batch = writeBatch(db);
    testimoniosValidos.forEach(testimonio => {
      batch.set(doc(testimoniosRef), {
        nombre: testimonio.nombre.trim().slice(0, 60),
        relacion: testimonio.relacion,
        calificacion: Math.min(5, Math.max(1, Number.parseInt(testimonio.calificacion, 10) || 1)),
        experiencia: testimonio.experiencia.trim().slice(0, 1000),
        createdAt: serverTimestamp()
      });
    });
    await batch.commit();
    localStorage.removeItem('drHenryTestimonios');
  } catch (error) {
    console.error('No se pudieron migrar los testimonios locales:', error);
  }
}

const listaCompleta = document.getElementById('testimoniosList');
if (listaCompleta) {
  migrarTestimoniosLocales();
  onSnapshot(
    query(testimoniosRef, orderBy('createdAt', 'desc'), limit(50)),
    snapshot => mostrarTestimonios(listaCompleta, snapshot.docs),
    () => {
      const status = document.getElementById('experienciaStatus');
      status.textContent = 'No se pudieron cargar las experiencias guardadas. Inténtalo nuevamente más tarde.';
      status.className = 'form-status is-error';
    }
  );
}

const listaInicio = document.getElementById('testimoniosGrid');
if (listaInicio) {
  onSnapshot(
    query(testimoniosRef, orderBy('createdAt', 'desc'), limit(2)),
    snapshot => mostrarTestimonios(listaInicio, snapshot.docs),
    error => console.error('No se pudieron cargar los testimonios:', error)
  );
}

const experienciaForm = document.getElementById('experienciaForm');
if (experienciaForm) {
  experienciaForm.addEventListener('submit', async event => {
    event.preventDefault();

    const button = experienciaForm.querySelector('button[type="submit"]');
    const status = document.getElementById('experienciaStatus');
    const original = button.textContent;
    const correo = document.getElementById('experienciaCorreo').value.trim();
    const testimonio = {
      nombre: document.getElementById('experienciaNombre').value.trim(),
      relacion: document.getElementById('experienciaRelacion').value,
      calificacion: Number.parseInt(document.getElementById('experienciaCalificacion').value, 10),
      experiencia: document.getElementById('experienciaTexto').value.trim()
    };

    if (experienciaForm.elements._honey.value) return;

    button.disabled = true;
    button.textContent = 'Enviando...';
    status.className = 'form-status';

    try {
      await addDoc(testimoniosRef, {
        ...testimonio,
        createdAt: serverTimestamp()
      });

      const formData = new FormData(experienciaForm);
      formData.set('_subject', `Nuevo testimonio de ${testimonio.nombre}`);
      if (correo) formData.set('_replyto', correo);

      fetch('https://formsubmit.co/ajax/henry.pacheco.md@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      }).catch(() => {});

      experienciaForm.reset();
      status.textContent = 'Gracias. Tu experiencia fue guardada y publicada correctamente.';
      status.className = 'form-status is-success';
    } catch (error) {
      console.error('No se pudo guardar el testimonio:', error);
      status.textContent = 'No pudimos guardar tu experiencia en este momento. Inténtalo nuevamente más tarde.';
      status.className = 'form-status is-error';
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  });
}

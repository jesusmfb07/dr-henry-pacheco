import { firebaseApp } from './firebase-config.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const ADMIN_UID = 'pNPsZ8BypheBCiWJArdbYi4n7LA2';
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const loginForm = document.getElementById('adminLoginForm');
const loginPanel = document.getElementById('adminLoginPanel');
const adminPanel = document.getElementById('adminPanel');
const status = document.getElementById('adminStatus');
const list = document.getElementById('adminTestimoniosList');
let unsubscribe = null;

function setStatus(message, type = '') {
  status.textContent = message;
  status.className = `form-status${type ? ` is-${type}` : ''}`;
}

function crearTestimonioAdmin(documento) {
  const data = documento.data();
  const article = document.createElement('article');
  const stars = document.createElement('div');
  const text = document.createElement('p');
  const author = document.createElement('div');
  const authorName = document.createElement('strong');
  const detail = document.createElement('span');
  const deleteButton = document.createElement('button');
  const rating = Math.min(5, Math.max(1, Number.parseInt(data.calificacion, 10) || 1));

  article.className = 'testimonio';
  stars.className = 'stars';
  stars.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  text.className = 'texto';
  text.textContent = `“${data.experiencia}”`;
  author.className = 'autor';
  authorName.textContent = data.nombre;
  detail.textContent = `${data.relacion} · ${documento.id}`;
  deleteButton.type = 'button';
  deleteButton.className = 'testimonio-delete';
  deleteButton.textContent = 'Eliminar comentario';
  deleteButton.addEventListener('click', async () => {
    if (!window.confirm(`¿Eliminar definitivamente el comentario de ${data.nombre}?`)) return;

    deleteButton.disabled = true;
    try {
      await deleteDoc(doc(db, 'testimonios', documento.id));
      setStatus('El comentario fue eliminado.', 'success');
    } catch (error) {
      console.error('No se pudo eliminar el testimonio:', error);
      setStatus('No se pudo eliminar el comentario. Verifica que las reglas estén publicadas.', 'error');
      deleteButton.disabled = false;
    }
  });

  author.append(authorName, detail);
  article.append(stars, text, author, deleteButton);
  return article;
}

function cargarTestimonios() {
  unsubscribe = onSnapshot(
    query(collection(db, 'testimonios'), orderBy('createdAt', 'desc')),
    snapshot => {
      list.replaceChildren(...snapshot.docs.map(crearTestimonioAdmin));
      if (snapshot.empty) list.textContent = 'No hay comentarios guardados.';
    },
    error => {
      console.error('No se pudieron cargar los testimonios:', error);
      setStatus('No se pudieron cargar los comentarios.', 'error');
    }
  );
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  const button = loginForm.querySelector('button[type="submit"]');
  button.disabled = true;
  setStatus('');

  try {
    await signInWithEmailAndPassword(
      auth,
      document.getElementById('adminEmail').value.trim(),
      document.getElementById('adminPassword').value
    );
    loginForm.reset();
  } catch (error) {
    console.error('No se pudo iniciar sesión:', error);
    setStatus('Correo o contraseña incorrectos.', 'error');
  } finally {
    button.disabled = false;
  }
});

document.getElementById('adminLogout').addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, user => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }

  const isAdmin = user?.uid === ADMIN_UID;
  loginPanel.hidden = isAdmin;
  adminPanel.hidden = !isAdmin;

  if (isAdmin) {
    setStatus('');
    cargarTestimonios();
  } else if (user) {
    signOut(auth);
    setStatus('Esta cuenta no tiene permisos de administrador.', 'error');
  }
});

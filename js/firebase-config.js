import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';

const firebaseConfig = {
  apiKey: 'AIzaSyA1PLjr00_iwo9OBTzMatMQwW-d5zw9K7g',
  authDomain: 'dr-henry-pacheco.firebaseapp.com',
  projectId: 'dr-henry-pacheco',
  storageBucket: 'dr-henry-pacheco.firebasestorage.app',
  messagingSenderId: '187825833363',
  appId: '1:187825833363:web:0b6c9ac345680cf83d1466'
};

export const firebaseApp = initializeApp(firebaseConfig);

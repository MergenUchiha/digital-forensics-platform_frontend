import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // ← КРИТИЧЕСКИ ВАЖНО: импорт стилей

// Добавляем консольное сообщение для проверки
console.log('🎨 Main.tsx loaded, styles imported');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
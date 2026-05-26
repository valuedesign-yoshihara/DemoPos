import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 💡 既存の手動登録（if ('serviceWorker' in navigator) { ... }）は丸ごと削除します。
// vite-plugin-pwa が裏側で自動的に登録スクリプトを注入してくれます。

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Auth } from './contexts/auth.jsx'
import './tailwind.css'; // 👈 Tailwind CSS here

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Auth>
    <App />
  </Auth>
  // </React.StrictMode>,
)

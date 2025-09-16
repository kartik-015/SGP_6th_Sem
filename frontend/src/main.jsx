import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/globals.css'
import './styles/auth.css'
import './styles/layout.css'
import './styles/tables.css'
import './styles/forms.css'
import './styles/dashboard.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme={localStorage.getItem('theme')==='dark'?'dark':'light'} />
  </StrictMode>,
)

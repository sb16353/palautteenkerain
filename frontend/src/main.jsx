import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Routing from './Routing.jsx'
import './style.css'
import './i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Routing/>
  </StrictMode>,
)

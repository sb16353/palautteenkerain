import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import App from './App.jsx'
import FeedbackView from './FeedbackView/FeedbackView.jsx'
import './style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/feedback/:roomId" element={<FeedbackView/>}/>
      </Routes>
    </BrowserRouter> 
  </StrictMode>,
)

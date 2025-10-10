import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import UserContext from './context/UserContext.jsx'

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <UserContext>
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
  </UserContext>,
)

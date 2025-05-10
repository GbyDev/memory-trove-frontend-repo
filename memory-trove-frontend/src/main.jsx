import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { AlbumDataProvider } from './contexts/AlbumContext.jsx'

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <AuthProvider> 
      <AlbumDataProvider>
        <App />
      </AlbumDataProvider>
    </AuthProvider>
  </StrictMode>
)

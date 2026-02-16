import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BrandingProvider } from "./context/BrandingContext";
import { ModalProvider } from "./context/ModalContext";
import { LoadingProvider } from "./context/LoadingContext";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> 
      <BrandingProvider>
        <AuthProvider>
          <LoadingProvider>
            <ModalProvider>
              <App />
            </ModalProvider>
          </LoadingProvider>
        </AuthProvider>
      </BrandingProvider>
    </BrowserRouter>
  </StrictMode>,
)

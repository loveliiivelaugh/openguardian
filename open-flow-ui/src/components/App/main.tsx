import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthPage from '@components/Auth/AuthPage';
import { AppRouter } from '@components/custom/routes/Router';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthPage />
      {/* <AppRouter /> */}
  </StrictMode>,
)

import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import { CVDataProvider } from '@/context/CVDataContext'
import Router from '@/Router'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CVDataProvider>
          <Router />
        </CVDataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

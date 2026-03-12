import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './components/layout/Header'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()

  // Routes where Header should NOT be shown
  const noHeaderRoutes = ['/login', '/register', '/callback']
  const shouldShowHeader = !noHeaderRoutes.includes(location.pathname)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {shouldShowHeader && <Header />}
      {children}
    </div>
  )
}

export default Layout

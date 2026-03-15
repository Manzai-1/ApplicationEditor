import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'

const AUTH_ROUTES = ['/login', '/register', '/verify', '/forgot-password', '/reset-password']

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const shouldShowHeader = !AUTH_ROUTES.includes(location.pathname)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {shouldShowHeader && <Header />}
      {children}
    </div>
  )
}

export default Layout

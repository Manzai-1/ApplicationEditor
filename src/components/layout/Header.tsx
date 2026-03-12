import UserMenu from './UserMenu'
import { siteConfig } from '@/config/site'

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-xl font-semibold text-foreground">{siteConfig.name}</span>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center">
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

export default Header

import siteMetadata from '@/data/siteMetadata'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
const Header = () => {
  return (
    <header className="flex items-center justify-between py-3">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Logo />
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
      </div>
      <div className="flex items-center leading-5 space-x-4 sm:space-x-6">
        <MobileNav />
      </div>
    </header>
  )
}

export default Header

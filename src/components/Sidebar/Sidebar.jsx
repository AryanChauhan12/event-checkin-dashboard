import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { ROUTES } from '@constants'
import './Sidebar.css'

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="5" rx="1.5" />
    <rect x="13" y="12" width="8" height="9" rx="1.5" />
    <rect x="3" y="15" width="8" height="6" rx="1.5" />
  </svg>
)

const CustomersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20c0-3.3 2.9-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
    <circle cx="17.5" cy="8.5" r="2.4" />
    <path d="M15.7 14.8c2.4.4 4.3 2.3 4.3 5.2" />
  </svg>
)

const ScannerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8" />
    <path d="M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8" />
    <path d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16" />
    <path d="M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
  </svg>
)

const BoothIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 9 12 4l8 5" />
    <path d="M5 9v10a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V9" />
  </svg>
)

const StatusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="6" y="4" width="12" height="17" rx="1.5" />
    <path d="M9 3.5h6v2H9z" />
    <path d="m9.5 13 2 2 3.5-4" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
    <path d="M16 17 21 12 16 7" />
    <path d="M21 12H9" />
  </svg>
)

const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: DashboardIcon },
  { label: 'Customers', path: ROUTES.CUSTOMERS, icon: CustomersIcon },
  { label: 'QR Scanner', path: ROUTES.QR_SCANNER, icon: ScannerIcon },
  { label: 'Booth Assignment', path: ROUTES.BOOTH_ASSIGNMENT, icon: BoothIcon },
  { label: 'Customer Status', path: ROUTES.CUSTOMER_STATUS, icon: StatusIcon },
]

const Sidebar = ({ isOpen, onNavigate }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`.trim()}>
      <div className="sidebar__brand">Event Check-In</div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`.trim()
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button type="button" className="sidebar__logout" onClick={handleLogout}>
        <LogoutIcon />
        <span>Logout</span>
      </button>
    </aside>
  )
}

export default Sidebar

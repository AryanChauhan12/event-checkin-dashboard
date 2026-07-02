import { Outlet } from 'react-router-dom'
import './AuthLayout.css'

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-layout__panel">
        <Outlet />
      </div>

      <footer className="auth-layout__footer">
        <p className="auth-layout__footer-primary">
          © 2026 Event Customer Check-In Dashboard
        </p>
        <p className="auth-layout__footer-secondary">ReactJS Technical Assignment</p>
      </footer>
    </div>
  )
}

export default AuthLayout

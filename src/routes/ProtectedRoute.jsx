import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { ROUTES } from '@constants'

const ProtectedRoute = ({ redirectAuthenticatedTo }) => {
  const { isAuthenticated } = useAuth()

  if (redirectAuthenticatedTo) {
    return isAuthenticated ? <Navigate to={redirectAuthenticatedTo} replace /> : <Outlet />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />
}

export default ProtectedRoute

import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@routes/ProtectedRoute'
import MainLayout from '@layouts/MainLayout'
import AuthLayout from '@layouts/AuthLayout'
import Login from '@pages/Login/Login'
import Dashboard from '@pages/Dashboard/Dashboard'
import Customers from '@pages/Customers/Customers'
import QRScanner from '@pages/QRScanner/QRScanner'
import BoothAssignment from '@pages/BoothAssignment/BoothAssignment'
import CustomerStatus from '@pages/CustomerStatus/CustomerStatus'
import NotFound from '@pages/NotFound/NotFound'
import { ROUTES } from '@constants'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute redirectAuthenticatedTo={ROUTES.DASHBOARD} />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.CUSTOMERS} element={<Customers />} />
          <Route path={ROUTES.QR_SCANNER} element={<QRScanner />} />
          <Route path={ROUTES.BOOTH_ASSIGNMENT} element={<BoothAssignment />} />
          <Route path={ROUTES.CUSTOMER_STATUS} element={<CustomerStatus />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes

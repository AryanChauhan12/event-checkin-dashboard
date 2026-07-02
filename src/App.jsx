import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from '@context/AuthContext'
import AppRoutes from '@routes/AppRoutes'
import { TOAST_AUTO_CLOSE_MS } from '@constants'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={TOAST_AUTO_CLOSE_MS}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

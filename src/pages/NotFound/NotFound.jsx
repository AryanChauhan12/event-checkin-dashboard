import { Link } from 'react-router-dom'
import { ROUTES } from '@constants'

const NotFound = () => {
  return (
    <div>
      <h1>404 — Page Not Found</h1>
      <Link to={ROUTES.DASHBOARD}>Back to Dashboard</Link>
    </div>
  )
}

export default NotFound

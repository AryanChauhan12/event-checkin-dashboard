import './ErrorState.css'

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="error-state">
      <p className="error-state_text">{message}</p>
      <button type="button" className="error-state_retry" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

export default ErrorState

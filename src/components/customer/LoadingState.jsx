import './LoadingState.css'

const LoadingState = () => {
  return (
    <div className="loading-state">
      <span className="loading-state_spinner" aria-hidden="true" />
      <p className="loading-state_text">Loading customers…</p>
    </div>
  )
}

export default LoadingState

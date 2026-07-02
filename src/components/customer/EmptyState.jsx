import './EmptyState.css'

const EmptyState = ({ title, message = 'No customers found.', onAddClick }) => {
  return (
    <div className="empty-state">
      <svg
        className="empty-state_icon"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 20c0-3.3 2.9-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
        <path d="M16 4 20 8" />
        <path d="M20 4 16 8" />
      </svg>
      {title && <h3 className="empty-state_title">{title}</h3>}
      <p className="empty-state_text">{message}</p>
      {onAddClick && (
        <button type="button" className="empty-state_add-btn" onClick={onAddClick}>
          + Add Customer
        </button>
      )}
    </div>
  )
}

export default EmptyState

import { useEscapeKey } from '@hooks/useEscapeKey'
import './DeleteCustomerModal.css'

const DeleteCustomerModal = ({ isOpen, customerName, isDeleting, onCancel, onConfirm }) => {
  useEscapeKey(isOpen && !isDeleting, onCancel)

  if (!isOpen) return null

  return (
    <div className="delete-modal_overlay" onClick={onCancel}>
      <div className="delete-modal" onClick={(event) => event.stopPropagation()}>
        <h2 className="delete-modal_title">Delete Customer</h2>
        <p className="delete-modal_message">Are you sure you want to delete this customer?</p>
        {customerName && <p className="delete-modal_customer-name">{customerName}</p>}
        <p className="delete-modal_warning">This action cannot be undone.</p>

        <div className="delete-modal_actions">
          <button
            type="button"
            className="delete-modal_cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="delete-modal_confirm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteCustomerModal

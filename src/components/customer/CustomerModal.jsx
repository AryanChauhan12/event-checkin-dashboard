import { useEscapeKey } from '@hooks/useEscapeKey'
import CustomerForm from './CustomerForm'
import './CustomerModal.css'

const CustomerModal = ({ isOpen, customer, nextQrCode, onClose, onSuccess }) => {
  useEscapeKey(isOpen, onClose)

  if (!isOpen) return null

  const isEditMode = Boolean(customer)

  return (
    <div className="customer-modal_overlay" onClick={onClose}>
      <div className="customer-modal" onClick={(event) => event.stopPropagation()}>
        <div className="customer-modal_header">
          <h2 className="customer-modal_title">
            {isEditMode ? 'Edit Customer' : 'Add Customer'}
          </h2>
          <button
            type="button"
            className="customer-modal_close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <CustomerForm
          customer={customer}
          nextQrCode={nextQrCode}
          onCancel={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  )
}

export default CustomerModal

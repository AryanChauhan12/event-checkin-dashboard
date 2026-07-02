import { useEscapeKey } from '@hooks/useEscapeKey'
import './CustomerDetailsModal.css'

const formatDate = (isoString) => {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const CustomerDetailsModal = ({ isOpen, customer, onClose }) => {
  useEscapeKey(isOpen, onClose)

  if (!isOpen || !customer) return null

  const details = [
    { label: 'Customer Name', value: customer.customerName },
    { label: 'Email', value: customer.email },
    { label: 'Mobile Number', value: customer.mobile },
    { label: 'Project Name', value: customer.projectName },
    { label: 'QR Code', value: customer.qrCode },
    { label: 'Event Status', value: customer.eventStatus },
    { label: 'Assigned Booth', value: customer.assignedBooth || '—' },
    { label: 'Checked-In Status', value: customer.checkedIn ? 'Checked In' : 'Not Checked In' },
    { label: 'Remarks', value: customer.remarks || '—' },
    { label: 'Created Date', value: formatDate(customer.createdAt) },
  ]

  return (
    <div className="customer-details_overlay" onClick={onClose}>
      <div className="customer-details" onClick={(event) => event.stopPropagation()}>
        <div className="customer-details_header">
          <h2 className="customer-details_title">Customer Details</h2>
          <button
            type="button"
            className="customer-details_close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <dl className="customer-details_list">
          {details.map((item) => (
            <div className="customer-details_row" key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

export default CustomerDetailsModal

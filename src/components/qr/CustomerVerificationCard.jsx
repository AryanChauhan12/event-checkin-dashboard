import './CustomerVerificationCard.css'

const CustomerVerificationCard = ({
  status,
  customer,
  scannedCode,
  isCheckingIn,
  onCheckIn,
}) => {
  if (status === 'loading') {
    return (
      <div className="verification-card_loading">
        <span className="verification-card_spinner" aria-hidden="true" />
        <p>Verifying customer...</p>
      </div>
    )
  }

  if (status === 'not-found') {
    return (
      <div className="verification-card_not-found">
        <h3>Customer Not Found</h3>
        <p>
          No customer matches QR code{' '}
          {scannedCode ? <strong>{scannedCode}</strong> : 'this code'}.
        </p>
      </div>
    )
  }

  if (status === 'found' && customer) {
    const details = [
      { label: 'Customer Name', value: customer.customerName },
      { label: 'Mobile Number', value: customer.mobile },
      { label: 'Email', value: customer.email },
      { label: 'Project Name', value: customer.projectName },
      { label: 'QR Code', value: customer.qrCode },
      { label: 'Event Status', value: customer.eventStatus },
      { label: 'Assigned Booth', value: customer.assignedBooth || '—' },
      { label: 'Checked-In Status', value: customer.checkedIn ? 'Checked In' : 'Not Checked In' },
    ]

    return (
      <div className="verification-card_found">
        <span className="verification-card_badge">Customer Verified</span>
        <dl className="verification-card_list">
          {details.map((item) => (
            <div className="verification-card_row" key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
        <div className="verification-card_actions">
          {customer.checkedIn ? (
            <p className="verification-card_checked-in-msg">Customer is already checked in.</p>
          ) : (
            <button
              type="button"
              className="verification-card_check-in-btn"
              onClick={onCheckIn}
              disabled={isCheckingIn}
            >
              {isCheckingIn ? 'Checking In…' : 'Check-In'}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <p className="verification-card_placeholder">
      Scan a QR code or enter one manually to verify a customer.
    </p>
  )
}

export default CustomerVerificationCard

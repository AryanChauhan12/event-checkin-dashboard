import { useState } from 'react'
import './ManualQRInput.css'

const ManualQRInput = ({ onSubmit, isVerifying }) => {
  const [value, setValue] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return

    onSubmit(trimmed)
    setValue('')
  }

  return (
    <form className="manual-qr" onSubmit={handleSubmit}>
      <label htmlFor="manual-qr-input">Enter QR Code</label>
      <div className="manual-qr_row">
        <input
          id="manual-qr-input"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="e.g. QR001"
          autoComplete="off"
        />
        <button type="submit" disabled={isVerifying || !value.trim()}>
          {isVerifying ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </form>
  )
}

export default ManualQRInput

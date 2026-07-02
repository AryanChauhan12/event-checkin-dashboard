import { useState } from 'react'
import { toast } from 'react-toastify'
import Card from '@components/Card/Card'
import QRScannerPanel from '@components/qr/QRScanner'
import ManualQRInput from '@components/qr/ManualQRInput'
import CustomerVerificationCard from '@components/qr/CustomerVerificationCard'
import { checkInCustomer, verifyQrCode } from '@services/qrService'
import './QRScanner.css'

const QRScanner = () => {
  const [status, setStatus] = useState('idle')
  const [customer, setCustomer] = useState(null)
  const [scannedCode, setScannedCode] = useState(null)
  const [isCheckingIn, setIsCheckingIn] = useState(false)

  const handleQrCode = async (qrCode) => {
    setStatus('loading')
    setScannedCode(qrCode)

    try {
      const matchedCustomer = await verifyQrCode(qrCode)

      if (matchedCustomer) {
        setCustomer(matchedCustomer)
        setStatus('found')
        toast.success(`Customer verified: ${matchedCustomer.customerName}`)
      } else {
        setCustomer(null)
        setStatus('not-found')
        toast.error('No customer found for this QR code.')
      }
    } catch {
      setStatus('idle')
      toast.error('Unable to verify customer. Please try again.')
    }
  }

  const handleCheckIn = async () => {
    if (!customer || isCheckingIn) return

    setIsCheckingIn(true)
    try {
      const updatedCustomer = await checkInCustomer(customer)
      setCustomer(updatedCustomer)
      toast.success(`${updatedCustomer.customerName} checked in successfully.`)
    } catch (error) {
      if (error.message === 'ALREADY_CHECKED_IN') {
        toast.error('This customer is already checked in.')
      } else {
        toast.error('Unable to check in customer. Please try again.')
      }
    } finally {
      setIsCheckingIn(false)
    }
  }

  return (
    <div className="qr-scanner-page">
      <div className="qr-scanner-page_grid">
        <Card title="Scan QR Code">
          <QRScannerPanel onScanSuccess={handleQrCode} />
        </Card>

        <Card title="Manual QR Entry">
          <ManualQRInput onSubmit={handleQrCode} isVerifying={status === 'loading'} />
        </Card>
      </div>

      <Card title="Verification Result">
        <CustomerVerificationCard
          status={status}
          customer={customer}
          scannedCode={scannedCode}
          isCheckingIn={isCheckingIn}
          onCheckIn={handleCheckIn}
        />
      </Card>
    </div>
  )
}

export default QRScanner

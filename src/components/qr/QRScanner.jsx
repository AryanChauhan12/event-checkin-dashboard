import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { toast } from 'react-toastify'
import './QRScanner.css'

const SCANNER_ELEMENT_ID = 'qr-scanner-region'

const getScanErrorMessage = (error) => {
  const name = error?.name || ''
  const message = String(error?.message || error || '')

  if (name === 'NotAllowedError' || /permission/i.test(message)) {
    return 'Camera permission denied. Please allow camera access and try again.'
  }
  if (name === 'NotFoundError' || /no camera|not found/i.test(message)) {
    return 'No camera found on this device.'
  }
  return 'Unable to start the camera. Please try again.'
}

const QRScanner = ({ onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const scannerRef = useRef(null)
  const hasScannedRef = useRef(false)

  const stopScanning = async () => {
    const scanner = scannerRef.current
    if (!scanner) return

    try {
      if (scanner.isScanning) {
        await scanner.stop()
      }
      scanner.clear()
    } catch {
      // Already stopped/cleared — nothing to do.
    }

    scannerRef.current = null
    setIsScanning(false)
  }

  const handleDecoded = (decodedText) => {
    // html5-qrcode keeps firing this while the same code is in frame —
    // only act on the first hit, then stop scanning.
    if (hasScannedRef.current) return
    hasScannedRef.current = true
    stopScanning()
    onScanSuccess(decodedText)
  }

  const startScanning = async () => {
    setErrorMessage(null)
    setIsStarting(true)
    hasScannedRef.current = false

    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID)
    scannerRef.current = scanner

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        handleDecoded,
        undefined
      )
      setIsScanning(true)
    } catch (error) {
      const message = getScanErrorMessage(error)
      setErrorMessage(message)
      toast.error(message)
      scannerRef.current = null
    } finally {
      setIsStarting(false)
    }
  }

  // Stop the camera stream if the user navigates away mid-scan.
  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="qr-scanner">
      <div className="qr-scanner_viewport">
        <div id={SCANNER_ELEMENT_ID} className="qr-scanner_region" />

        {!isScanning && (
          <div className="qr-scanner_placeholder">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8" />
              <path d="M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8" />
              <path d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16" />
              <path d="M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
            <p>Camera preview will appear here</p>
          </div>
        )}
      </div>

      {errorMessage && <p className="qr-scanner_error">{errorMessage}</p>}

      <div className="qr-scanner_actions">
        {!isScanning ? (
          <button
            type="button"
            className="qr-scanner_start"
            onClick={startScanning}
            disabled={isStarting}
          >
            {isStarting ? 'Starting...' : 'Start Scan'}
          </button>
        ) : (
          <button type="button" className="qr-scanner_stop" onClick={stopScanning}>
            Stop Scan
          </button>
        )}
      </div>
    </div>
  )
}

export default QRScanner

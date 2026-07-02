import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Card from '@components/Card/Card'
import SearchBar from '@components/customer/SearchBar'
import LoadingState from '@components/customer/LoadingState'
import EmptyState from '@components/customer/EmptyState'
import ErrorState from '@components/customer/ErrorState'
import StatusTimeline from '@components/customer/StatusTimeline'
import { EVENT_STATUSES } from '@constants'
import { getCustomers } from '@services/customerService'
import {
  getStatusHistoryByCustomerId,
  updateCustomerStatus,
} from '@services/statusService'
import './CustomerStatus.css'

const CustomerStatus = () => {
  const [customers, setCustomers] = useState([])
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      status: 'Waiting',
      remarks: '',
      followUpDate: '',
    },
  })

  const loadCustomers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch {
      setError('Failed to load customers. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const loadHistory = async (customerId) => {
    setIsHistoryLoading(true)
    try {
      const data = await getStatusHistoryByCustomerId(customerId)
      setHistory(data)
    } catch {
      toast.error('Unable to load status history.')
      setHistory([])
    } finally {
      setIsHistoryLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    if (!selectedCustomer) {
      setHistory([])
      return
    }

    loadHistory(selectedCustomer.id)
    reset({
      status: selectedCustomer.eventStatus,
      remarks: selectedCustomer.remarks ?? '',
      followUpDate: '',
    })
  }, [selectedCustomer, reset])

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredCustomers = customers.filter((customer) => {
    if (!normalizedSearch) return true
    return (
      customer.customerName.toLowerCase().includes(normalizedSearch) ||
      customer.mobile.toLowerCase().includes(normalizedSearch) ||
      customer.qrCode.toLowerCase().includes(normalizedSearch)
    )
  })

  const onSubmit = async (formValues) => {
    if (!selectedCustomer) return

    try {
      const updatedCustomer = await updateCustomerStatus(selectedCustomer, {
        status: formValues.status,
        remarks: formValues.remarks.trim(),
        followUpDate: formValues.followUpDate || null,
      })

      toast.success(`Status updated for ${updatedCustomer.customerName}.`)
      // Updating selectedCustomer re-triggers the effect above, which
      // reloads the history and resets the form — no need to do it here too.
      setSelectedCustomer(updatedCustomer)
      setCustomers((current) =>
        current.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        )
      )
    } catch {
      toast.error('Unable to update customer status. Please try again.')
    }
  }

  return (
    <div className="customer-status-page">
      {isLoading && <LoadingState />}

      {!isLoading && error && <ErrorState message={error} onRetry={loadCustomers} />}

      {!isLoading && !error && (
        <div className="customer-status-page_grid">
          <Card title="Select Customer">
            <div className="customer-status-page_search">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by name, mobile, or QR code"
              />
            </div>

            {filteredCustomers.length === 0 ? (
              <EmptyState
                title="No customers found"
                message={
                  customers.length === 0
                    ? 'Add customers before updating their status.'
                    : 'Try adjusting your search.'
                }
              />
            ) : (
              <div className="customer-status-list">
                {filteredCustomers.map((customer) => {
                  const isSelected = selectedCustomer?.id === customer.id

                  return (
                    <button
                      key={customer.id}
                      type="button"
                      className={`customer-status-item${isSelected ? ' customer-status-item_selected' : ''}`}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <span className="customer-status-item_name">{customer.customerName}</span>
                      <span className="customer-status-item_meta">{customer.mobile}</span>
                      <span className="customer-status-item_meta">{customer.qrCode}</span>
                      <span className="customer-status-item_status">{customer.eventStatus}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </Card>

          <div className="customer-status-page_right">
            <Card title="Update Status">
              {selectedCustomer ? (
                <form className="customer-status-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <p className="customer-status-form_summary">
                    Updating status for <strong>{selectedCustomer.customerName}</strong>
                  </p>

                  <div className="customer-status-form_field">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      {...register('status', { required: 'Status is required' })}
                    >
                      {EVENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {errors.status && (
                      <span className="customer-status-form_error">{errors.status.message}</span>
                    )}
                  </div>

                  <div className="customer-status-form_field">
                    <label htmlFor="remarks">Remarks</label>
                    <textarea
                      id="remarks"
                      rows={4}
                      placeholder="Add notes about this status update"
                      {...register('remarks', {
                        required: 'Remarks are required',
                        minLength: { value: 3, message: 'Remarks must be at least 3 characters' },
                      })}
                    />
                    {errors.remarks && (
                      <span className="customer-status-form_error">{errors.remarks.message}</span>
                    )}
                  </div>

                  <div className="customer-status-form_field">
                    <label htmlFor="followUpDate">Follow-up Date</label>
                    <input
                      id="followUpDate"
                      type="date"
                      {...register('followUpDate', {
                        validate: (value) => {
                          if (getValues('status') === 'Follow-Up Required' && !value) {
                            return 'Follow-up date is required for this status'
                          }
                          return true
                        },
                      })}
                    />
                    {errors.followUpDate && (
                      <span className="customer-status-form_error">
                        {errors.followUpDate.message}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="customer-status-form_submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving…' : 'Save Status Update'}
                  </button>
                </form>
              ) : (
                <p className="customer-status-form_placeholder">
                  Select a customer to update their status.
                </p>
              )}
            </Card>

            <Card title="Status Timeline">
              {!selectedCustomer ? (
                <p className="customer-status-form_placeholder">
                  Status history will appear here after you select a customer.
                </p>
              ) : isHistoryLoading ? (
                <div className="customer-status-history_loading">
                  <span className="customer-status-history_spinner" aria-hidden="true" />
                  <p>Loading history…</p>
                </div>
              ) : (
                <StatusTimeline history={history} />
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerStatus

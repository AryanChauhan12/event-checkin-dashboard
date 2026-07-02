import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Card from '@components/Card/Card'
import SearchBar from '@components/customer/SearchBar'
import LoadingState from '@components/customer/LoadingState'
import EmptyState from '@components/customer/EmptyState'
import ErrorState from '@components/customer/ErrorState'
import { getCustomers } from '@services/customerService'
import {
  assignBoothToCustomer,
  getBooths,
  removeBoothAssignment,
} from '@services/boothService'
import './BoothAssignment.css'

const BoothAssignment = () => {
  const [customers, setCustomers] = useState([])
  const [booths, setBooths] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [selectedBoothId, setSelectedBoothId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [customerData, boothData] = await Promise.all([getCustomers(), getBooths()])
      setCustomers(customerData)
      setBooths(boothData)
    } catch {
      setError('Failed to load booth assignment data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const checkedInCustomers = customers.filter((customer) => customer.checkedIn)
  const availableBooths = booths.filter((booth) => booth.status === 'Available')

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredCustomers = checkedInCustomers.filter((customer) => {
    if (!normalizedSearch) return true
    return (
      customer.customerName.toLowerCase().includes(normalizedSearch) ||
      customer.mobile.toLowerCase().includes(normalizedSearch)
    )
  })

  const selectedCustomer = checkedInCustomers.find(
    (customer) => String(customer.id) === selectedCustomerId
  )

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomerId(customerId)
    setSelectedBoothId('')
  }

  const handleAssign = async () => {
    if (!selectedCustomer || !selectedBoothId || isSubmitting) return

    const booth = booths.find((item) => String(item.id) === selectedBoothId)
    if (!booth) return

    setIsSubmitting(true)
    try {
      await assignBoothToCustomer(selectedCustomer, booth)
      toast.success(`${selectedCustomer.customerName} assigned to Booth ${booth.boothNumber}.`)
      setSelectedCustomerId('')
      setSelectedBoothId('')
      await loadData()
    } catch (assignError) {
      if (assignError.message === 'BOOTH_NOT_AVAILABLE' || assignError.message === 'BOOTH_ALREADY_ASSIGNED') {
        toast.error('This booth is no longer available. Please select another booth.')
      } else if (assignError.message === 'NOT_CHECKED_IN') {
        toast.error('Only checked-in customers can be assigned to a booth.')
      } else {
        toast.error('Unable to assign booth. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemove = async (customer) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await removeBoothAssignment(customer)
      toast.success(`Booth assignment removed for ${customer.customerName}.`)
      if (String(customer.id) === selectedCustomerId) {
        setSelectedCustomerId('')
        setSelectedBoothId('')
      }
      await loadData()
    } catch (removeError) {
      if (removeError.message === 'NO_BOOTH_ASSIGNED') {
        toast.error('This customer has no booth assignment to remove.')
      } else {
        toast.error('Unable to remove booth assignment. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="booth-assignment-page">
      {isLoading && <LoadingState />}

      {!isLoading && error && <ErrorState message={error} onRetry={loadData} />}

      {!isLoading && !error && (
        <div className="booth-assignment-page_grid">
          <Card title="Checked-In Customers">
            <div className="booth-assignment-page_search">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by name or mobile"
              />
            </div>

            {filteredCustomers.length === 0 ? (
              <EmptyState
                title="No checked-in customers"
                message={
                  checkedInCustomers.length === 0
                    ? 'Customers must check in before they can be assigned to a booth.'
                    : 'Try adjusting your search.'
                }
              />
            ) : (
              <div className="booth-customer-list">
                {filteredCustomers.map((customer) => {
                  const isSelected = String(customer.id) === selectedCustomerId

                  return (
                    <div
                      key={customer.id}
                      className={`booth-customer-item${isSelected ? ' booth-customer-item_selected' : ''}`}
                    >
                      <button
                        type="button"
                        className="booth-customer-item_select"
                        onClick={() => handleCustomerSelect(String(customer.id))}
                      >
                        <span className="booth-customer-item_name">{customer.customerName}</span>
                        <span className="booth-customer-item_meta">{customer.mobile}</span>
                        <span className="booth-customer-item_meta">{customer.projectName}</span>
                        <span className="booth-customer-item_booth">
                          {customer.assignedBooth
                            ? `Booth ${customer.assignedBooth}`
                            : 'No booth assigned'}
                        </span>
                      </button>

                      {customer.assignedBooth && (
                        <button
                          type="button"
                          className="booth-customer-item_remove"
                          onClick={() => handleRemove(customer)}
                          disabled={isSubmitting}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          <div className="booth-assignment-page_right">
            <Card title="Available Booths">
              {availableBooths.length === 0 ? (
                <EmptyState
                  title="No booths available"
                  message="All booths are currently occupied. Remove an assignment to free a booth."
                />
              ) : (
                <div className="booth-grid">
                  {availableBooths.map((booth) => {
                    const isSelected = String(booth.id) === selectedBoothId

                    return (
                      <button
                        key={booth.id}
                        type="button"
                        className={`booth-card${isSelected ? ' booth-card_selected' : ''}`}
                        onClick={() => setSelectedBoothId(String(booth.id))}
                        disabled={!selectedCustomerId || isSubmitting}
                      >
                        <span className="booth-card_number">{booth.boothNumber}</span>
                        <span className="booth-card_manager">{booth.salesManager}</span>
                        <span className="booth-card_status">Available</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </Card>

            <Card title="Assign Booth">
              {selectedCustomer ? (
                <div className="booth-assign-panel">
                  <p className="booth-assign-panel_summary">
                    Assigning <strong>{selectedCustomer.customerName}</strong>
                    {selectedCustomer.assignedBooth
                      ? ` (currently Booth ${selectedCustomer.assignedBooth})`
                      : ''}
                  </p>

                  <div className="booth-assign-panel_field">
                    <label htmlFor="boothSelect">Select Booth</label>
                    <select
                      id="boothSelect"
                      value={selectedBoothId}
                      onChange={(event) => setSelectedBoothId(event.target.value)}
                      disabled={isSubmitting}
                    >
                      <option value="">Choose an available booth</option>
                      {availableBooths.map((booth) => (
                        <option key={booth.id} value={booth.id}>
                          {booth.boothNumber} — {booth.salesManager}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    className="booth-assign-panel_submit"
                    onClick={handleAssign}
                    disabled={!selectedBoothId || isSubmitting}
                  >
                    {isSubmitting
                      ? 'Saving…'
                      : selectedCustomer.assignedBooth
                        ? 'Change Booth'
                        : 'Assign Booth'}
                  </button>
                </div>
              ) : (
                <p className="booth-assign-panel_placeholder">
                  Select a checked-in customer to assign or change their booth.
                </p>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default BoothAssignment

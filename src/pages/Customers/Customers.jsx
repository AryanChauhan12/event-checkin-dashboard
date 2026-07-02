import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { deleteCustomer, getCustomers } from '@services/customerService'
import SearchBar from '@components/customer/SearchBar'
import StatusFilter from '@components/customer/StatusFilter'
import CustomerTable from '@components/customer/CustomerTable'
import CustomerModal from '@components/customer/CustomerModal'
import CustomerDetailsModal from '@components/customer/CustomerDetailsModal'
import DeleteCustomerModal from '@components/customer/DeleteCustomerModal'
import Pagination from '@components/customer/Pagination'
import LoadingState from '@components/customer/LoadingState'
import EmptyState from '@components/customer/EmptyState'
import ErrorState from '@components/customer/ErrorState'
import './Customers.css'

const CUSTOMERS_PER_PAGE = 10

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [viewingCustomer, setViewingCustomer] = useState(null)
  const [deletingCustomer, setDeletingCustomer] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  useEffect(() => {
    loadCustomers()
  }, [])

  const handleAddClick = () => {
    setEditingCustomer(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (customer) => {
    setEditingCustomer(customer)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingCustomer(null)
  }

  const handleSaveSuccess = () => {
    handleModalClose()
    loadCustomers()
  }

  // Search/filter changes can shrink the result set below the current
  // page, so jump back to page 1 whenever either one changes.
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleViewClick = (customer) => {
    setViewingCustomer(customer)
  }

  const handleDeleteClick = (customer) => {
    setDeletingCustomer(customer)
  }

  const handleDeleteCancel = () => {
    if (isDeleting) return
    setDeletingCustomer(null)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await deleteCustomer(deletingCustomer.id)
      toast.success('Customer deleted successfully.')
      setDeletingCustomer(null)
      loadCustomers()
    } catch {
      toast.error('Unable to delete customer.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Filtering runs on every render instead of an effect — it's a cheap
  // derived value, no need to stash it in state.
  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      !normalizedSearch ||
      customer.customerName.toLowerCase().includes(normalizedSearch) ||
      customer.mobile.toLowerCase().includes(normalizedSearch)

    const matchesStatus = statusFilter === 'All' || customer.eventStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  // Sequential QR code for the next customer, e.g. QR026 for the 26th entry.
  const nextQrCode = `QR${String(customers.length + 1).padStart(3, '0')}`

  // Clamp in case a delete or filter change leaves currentPage past the end.
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedCustomers = filteredCustomers.slice(
    (safePage - 1) * CUSTOMERS_PER_PAGE,
    safePage * CUSTOMERS_PER_PAGE
  )

  return (
    <div className="customers-page">
      <div className="customers-page_toolbar">
        <div className="customers-page_filters">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name or mobile number"
          />
          <StatusFilter value={statusFilter} onChange={handleStatusChange} />
        </div>

        <button type="button" className="customers-page_add-btn" onClick={handleAddClick}>
          + Add Customer
        </button>
      </div>

      {isLoading && <LoadingState />}

      {!isLoading && error && <ErrorState message={error} onRetry={loadCustomers} />}

      {!isLoading && !error && filteredCustomers.length === 0 && customers.length === 0 && (
        <EmptyState
          title="No customers found"
          message="Get started by adding your first customer."
          onAddClick={handleAddClick}
        />
      )}

      {!isLoading && !error && filteredCustomers.length === 0 && customers.length > 0 && (
        <EmptyState
          title="No matches found"
          message="Try adjusting your search or status filter."
        />
      )}

      {!isLoading && !error && filteredCustomers.length > 0 && (
        <>
          <CustomerTable
            customers={paginatedCustomers}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <CustomerModal
        isOpen={isModalOpen}
        customer={editingCustomer}
        nextQrCode={nextQrCode}
        onClose={handleModalClose}
        onSuccess={handleSaveSuccess}
      />

      <CustomerDetailsModal
        isOpen={Boolean(viewingCustomer)}
        customer={viewingCustomer}
        onClose={() => setViewingCustomer(null)}
      />

      <DeleteCustomerModal
        isOpen={Boolean(deletingCustomer)}
        customerName={deletingCustomer?.customerName}
        isDeleting={isDeleting}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export default Customers

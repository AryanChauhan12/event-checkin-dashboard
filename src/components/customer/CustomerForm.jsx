import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { addCustomer, updateCustomer } from '@services/customerService'
import { EVENT_STATUSES } from '@constants'
import './CustomerForm.css'

const MOBILE_PATTERN = /^[6-9]\d{9}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CustomerForm = ({ customer, nextQrCode, onCancel, onSuccess }) => {
  const isEditMode = Boolean(customer)
  const qrCode = customer?.qrCode ?? nextQrCode

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      customerName: customer?.customerName ?? '',
      mobile: customer?.mobile ?? '',
      email: customer?.email ?? '',
      projectName: customer?.projectName ?? '',
      eventStatus: customer?.eventStatus ?? 'Waiting',
    },
  })

  const onSubmit = async (formValues) => {
    // Keep checkedIn in sync with the selected status so a customer created
    // or edited straight to e.g. "Assigned" doesn't stay marked as not
    // checked-in, which would hide them from the check-in-gated screens.
    const checkedIn = isEditMode
      ? customer.checkedIn || formValues.eventStatus !== 'Waiting'
      : formValues.eventStatus !== 'Waiting'

    try {
      if (isEditMode) {
        await updateCustomer(customer.id, { ...customer, ...formValues, qrCode, checkedIn })
        toast.success('Customer updated successfully.')
      } else {
        await addCustomer({
          ...formValues,
          qrCode,
          assignedBooth: null,
          checkedIn,
          remarks: '',
          createdAt: new Date().toISOString(),
        })
        toast.success('Customer added successfully.')
      }
      onSuccess()
    } catch {
      toast.error('Unable to save customer.')
    }
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="customer-form_field">
        <label htmlFor="customerName">Customer Name</label>
        <input
          id="customerName"
          type="text"
          placeholder="Enter full name"
          {...register('customerName', {
            required: 'Customer name is required',
            minLength: { value: 3, message: 'Name must be at least 3 characters' },
          })}
        />
        {errors.customerName && (
          <span className="customer-form_error">{errors.customerName.message}</span>
        )}
      </div>

      <div className="customer-form_field">
        <label htmlFor="mobile">Mobile Number</label>
        <input
          id="mobile"
          type="tel"
          placeholder="10-digit mobile number"
          {...register('mobile', {
            required: 'Mobile number is required',
            pattern: {
              value: MOBILE_PATTERN,
              message: 'Enter a valid 10-digit Indian mobile number',
            },
          })}
        />
        {errors.mobile && <span className="customer-form_error">{errors.mobile.message}</span>}
      </div>

      <div className="customer-form_field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="customer@example.com"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address' },
          })}
        />
        {errors.email && <span className="customer-form_error">{errors.email.message}</span>}
      </div>

      <div className="customer-form_field">
        <label htmlFor="projectName">Project Name</label>
        <input
          id="projectName"
          type="text"
          placeholder="Enter project name"
          {...register('projectName', { required: 'Project name is required' })}
        />
        {errors.projectName && (
          <span className="customer-form_error">{errors.projectName.message}</span>
        )}
      </div>

      <div className="customer-form_field">
        <label htmlFor="qrCode">QR Code</label>
        <input
          id="qrCode"
          type="text"
          value={qrCode}
          readOnly
          className="customer-form_readonly"
        />
      </div>

      <div className="customer-form_field">
        <label htmlFor="eventStatus">Event Status</label>
        <select id="eventStatus" {...register('eventStatus', { required: true })}>
          {EVENT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="customer-form_actions">
        <button type="button" className="customer-form_cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="customer-form_submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? 'Updating...'
              : 'Adding...'
            : isEditMode
              ? 'Update Customer'
              : 'Add Customer'}
        </button>
      </div>
    </form>
  )
}

export default CustomerForm

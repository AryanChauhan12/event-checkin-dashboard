import { getCustomers, updateCustomer } from './customerService'
import { addStatusHistory } from './statusService'

export const verifyQrCode = async (qrCode) => {
  const customers = await getCustomers()
  const normalizedCode = qrCode.trim().toLowerCase()

  return customers.find((customer) => customer.qrCode.toLowerCase() === normalizedCode) ?? null
}

export const checkInCustomer = async (customer) => {
  if (customer.checkedIn) {
    throw new Error('ALREADY_CHECKED_IN')
  }

  const updatedCustomer = await updateCustomer(customer.id, {
    ...customer,
    checkedIn: true,
    eventStatus: 'Checked-In',
  })

  await addStatusHistory({
    customerId: customer.id,
    status: 'Checked-In',
    remarks: 'Verified via QR and checked in',
    followUpDate: null,
    updatedAt: new Date().toISOString(),
  })

  return updatedCustomer
}

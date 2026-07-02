import axiosClient from '@api/axiosClient'
import { updateCustomer } from './customerService'

export const getStatusHistory = async () => {
  return axiosClient.get('/customerStatusHistory')
}

export const addStatusHistory = async (entry) => {
  return axiosClient.post('/customerStatusHistory', entry)
}

export const getStatusHistoryByCustomerId = async (customerId) => {
  const history = await getStatusHistory()
  return history
    .filter((entry) => entry.customerId === customerId)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export const updateCustomerStatus = async (customer, { status, remarks, followUpDate }) => {
  const updatedCustomer = await updateCustomer(customer.id, {
    ...customer,
    eventStatus: status,
    remarks,
  })

  await addStatusHistory({
    customerId: customer.id,
    status,
    remarks,
    followUpDate: followUpDate || null,
    updatedAt: new Date().toISOString(),
  })

  return updatedCustomer
}

import axiosClient from '@api/axiosClient'

export const getCustomers = async () => {
  return axiosClient.get('/customers')
}

export const addCustomer = async (customerData) => {
  return axiosClient.post('/customers', customerData)
}

export const updateCustomer = async (id, customerData) => {
  return axiosClient.put(`/customers/${id}`, customerData)
}

export const deleteCustomer = async (id) => {
  return axiosClient.delete(`/customers/${id}`)
}

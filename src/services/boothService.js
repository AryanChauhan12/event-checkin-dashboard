import axiosClient from '@api/axiosClient'
import { updateCustomer } from './customerService'
import { addStatusHistory } from './statusService'

export const getBooths = async () => {
  return axiosClient.get('/boothAssignments')
}

export const updateBooth = async (id, boothData) => {
  return axiosClient.put(`/boothAssignments/${id}`, boothData)
}

const buildAvailableBooth = (booth) => {
  return {
    id: booth.id,
    boothNumber: booth.boothNumber,
    salesManager: booth.salesManager,
    status: 'Available',
  }
}

const buildOccupiedBooth = (booth, customerId) => {
  return {
    ...booth,
    status: 'Occupied',
    customerId,
  }
}

export const assignBoothToCustomer = async (customer, booth) => {
  if (!customer.checkedIn) {
    throw new Error('NOT_CHECKED_IN')
  }

  if (booth.status !== 'Available') {
    throw new Error('BOOTH_NOT_AVAILABLE')
  }

  if (booth.customerId && booth.customerId !== customer.id) {
    throw new Error('BOOTH_ALREADY_ASSIGNED')
  }

  const booths = await getBooths()

  if (customer.assignedBooth && customer.assignedBooth !== booth.boothNumber) {
    const currentBooth = booths.find((item) => item.boothNumber === customer.assignedBooth)
    if (currentBooth) {
      await updateBooth(currentBooth.id, buildAvailableBooth(currentBooth))
    }
  }

  await updateBooth(booth.id, buildOccupiedBooth(booth, customer.id))

  const updatedCustomer = await updateCustomer(customer.id, {
    ...customer,
    assignedBooth: booth.boothNumber,
    eventStatus: 'Assigned',
  })

  await addStatusHistory({
    customerId: customer.id,
    status: 'Assigned',
    remarks: `Assigned to booth ${booth.boothNumber} with sales manager ${booth.salesManager}`,
    followUpDate: null,
    updatedAt: new Date().toISOString(),
  })

  return updatedCustomer
}

export const removeBoothAssignment = async (customer) => {
  if (!customer.assignedBooth) {
    throw new Error('NO_BOOTH_ASSIGNED')
  }

  const booths = await getBooths()
  const booth = booths.find(
    (item) => item.boothNumber === customer.assignedBooth || item.customerId === customer.id
  )

  if (booth) {
    await updateBooth(booth.id, buildAvailableBooth(booth))
  }

  const updatedCustomer = await updateCustomer(customer.id, {
    ...customer,
    assignedBooth: null,
    eventStatus: customer.checkedIn ? 'Checked-In' : customer.eventStatus,
  })

  await addStatusHistory({
    customerId: customer.id,
    status: customer.checkedIn ? 'Checked-In' : customer.eventStatus,
    remarks: `Booth ${customer.assignedBooth} assignment removed`,
    followUpDate: null,
    updatedAt: new Date().toISOString(),
  })

  return updatedCustomer
}

import { EVENT_STATUSES } from '@constants'
import { getCustomers } from './customerService'

export const getDashboardStats = async () => {
  const customers = await getCustomers()

  const statusCounts = EVENT_STATUSES.reduce((counts, status) => {
    counts[status] = customers.filter((customer) => customer.eventStatus === status).length
    return counts
  }, {})

  const summary = {
    totalCustomers: customers.length,
    checkedIn: customers.filter((customer) => customer.checkedIn).length,
    waiting: statusCounts['Waiting'],
    assigned: statusCounts['Assigned'],
    completed: statusCounts['Completed'],
  }

  const chartData = EVENT_STATUSES.map((status) => ({
    status: status === 'Follow-Up Required' ? 'Follow-Up' : status,
    count: statusCounts[status],
  }))

  return { summary, chartData }
}

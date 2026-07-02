import { EVENT_STATUS_FILTERS } from '@constants'
import './StatusFilter.css'

const StatusFilter = ({ value, onChange }) => {
  return (
    <select
      className="status-filter"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Filter by event status"
    >
      {EVENT_STATUS_FILTERS.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )
}

export default StatusFilter

import { getStatusBadgeClass } from '@utils/statusBadge'
import '@components/customer/CustomerTableRow.css'
import './StatusTimeline.css'

const formatDateTime = (isoDate) => {
  return new Date(isoDate).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const StatusTimeline = ({ history }) => {
  if (history.length === 0) {
    return (
      <p className="status-timeline_empty">No status history yet for this customer.</p>
    )
  }

  return (
    <ol className="status-timeline">
      {history.map((entry) => (
        <li className="status-timeline_item" key={entry.id}>
          <div className="status-timeline_marker" aria-hidden="true" />
          <div className="status-timeline_content">
            <div className="status-timeline_header">
              <span className={getStatusBadgeClass(entry.status)}>
                {entry.status}
              </span>
              <time className="status-timeline_time" dateTime={entry.updatedAt}>
                {formatDateTime(entry.updatedAt)}
              </time>
            </div>
            {entry.remarks && <p className="status-timeline_remarks">{entry.remarks}</p>}
            {entry.followUpDate && (
              <p className="status-timeline_follow-up">
                Follow-up: {new Date(entry.followUpDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}

export default StatusTimeline

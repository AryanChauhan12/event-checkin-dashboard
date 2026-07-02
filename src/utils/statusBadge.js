export const STATUS_BADGE_CLASS = {
  Waiting: 'status-badge status-badge_waiting',
  'Checked-In': 'status-badge status-badge_checked-in',
  Assigned: 'status-badge status-badge_assigned',
  'In Discussion': 'status-badge status-badge_in-discussion',
  Completed: 'status-badge status-badge_completed',
  'Follow-Up Required': 'status-badge status-badge_follow-up',
}

export const getStatusBadgeClass = (status) => STATUS_BADGE_CLASS[status] || 'status-badge'

import Card from '@components/Card/Card'
import './SummaryCard.css'

const SummaryCard = ({ label, value, icon, accent }) => {
  return (
    <Card className="summary-card">
      <div className="summary-card__icon" style={{ '--summary-accent': accent }}>
        {icon}
      </div>
      <div className="summary-card__text">
        <span className="summary-card__value">{value}</span>
        <span className="summary-card__label">{label}</span>
      </div>
    </Card>
  )
}

export default SummaryCard


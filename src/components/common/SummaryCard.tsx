interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
}

function SummaryCard({
  title,
  value,
  description,
}: SummaryCardProps) {
  return (
    <div className="summary-card">
      <p className="summary-card-title">
        {title}
      </p>

      <h3 className="summary-card-value">
        {value}
      </h3>

      <p className="summary-card-description">
        {description}
      </p>
    </div>
  );
}

export default SummaryCard;
import "./Card.css";

const Card = ({ title, className = "", children }) => {
  return (
    <section className={`card ${className}`.trim()}>
      {title && <h2 className="card_title">{title}</h2>}
      <div className="card_body">{children}</div>
    </section>
  );
};

export default Card;

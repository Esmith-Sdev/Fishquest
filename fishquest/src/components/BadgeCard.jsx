export default function BadgeCard({ badge, unlocked, onClick }) {
  return (
    <div
      className={`badge-card ${unlocked ? "unlocked" : "locked"}`}
      onClick={onClick}
    >
      <img src={badge.icon} alt={badge.name} className="badge-img" />
    </div>
  );
}

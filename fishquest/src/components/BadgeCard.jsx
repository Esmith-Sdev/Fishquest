export default function BadgeCard({ badge, unlocked, current, needed }) {
  return (
    <div className={`badge-card ${unlocked ? "unlocked" : "locked"}`}>
      <img src={badge.icon} alt={badge.name} className="badge-img" />
    </div>
  );
}

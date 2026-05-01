import { getFreshnessInfo, sortByUrgency, getFridgeMood } from '../utils/foodSafety'
import ItemCard from './ItemCard'
import FridgeStats from './FridgeStats'

export default function FridgeDashboard({ items, onEaten, onDisposed, stats, onAddItem }) {
  const sorted = sortByUrgency(items)
  const urgentItems = items.filter(i => {
    const { status } = getFreshnessInfo(i)
    return status === 'eat-today' || status === 'toss'
  })
  const mood = getFridgeMood(items)

  return (
    <div className="screen">
      <header className="screen-header">
        <div>
          <h1 className="app-title">🧊 Fridge Detective</h1>
          <p className="app-subtitle">Evidence-based eating, since today.</p>
        </div>
      </header>

      {urgentItems.length > 0 && (
        <div className="urgency-banner">
          <span className="urgency-icon">🚨</span>
          <div>
            <strong>
              {urgentItems.length === 1
                ? '1 item needs your attention today'
                : `${urgentItems.length} items need your attention today`}
            </strong>
            <p>Scroll down. Deal with them. We'll wait.</p>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{mood.emoji}</div>
          <p className="empty-message">{mood.message}</p>
          <button className="btn-primary" onClick={onAddItem}>
            Add your first suspect
          </button>
        </div>
      ) : (
        <>
          <div className="mood-bar">
            <span>{mood.emoji}</span>
            <p>{mood.message}</p>
          </div>

          <div className="items-list">
            {sorted.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onEaten={onEaten}
                onDisposed={onDisposed}
              />
            ))}
          </div>
        </>
      )}

      <FridgeStats stats={stats} />
    </div>
  )
}

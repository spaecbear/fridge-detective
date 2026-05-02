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
          <h1 className="app-title">🔍 Fridge Detective</h1>
          <p className="app-subtitle">Every leftover has a story. Some are tragedies.</p>
        </div>
      </header>

      {urgentItems.length > 0 && (
        <div className="urgency-banner">
          <span className="urgency-icon">🚨</span>
          <div>
            <strong>
              {urgentItems.length === 1
                ? '1 suspect requires immediate action'
                : `${urgentItems.length} suspects require immediate action`}
            </strong>
            <p>Scroll down. The evidence won't hold forever.</p>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{mood.emoji}</div>
          <p className="empty-message">{mood.message}</p>
          <button className="btn-primary" onClick={onAddItem}>
            Open your first case file
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

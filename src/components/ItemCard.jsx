import { useState } from 'react'
import { CATEGORIES, getFreshnessInfo, formatDaysRemaining } from '../utils/foodSafety'

export default function ItemCard({ item, onEaten, onDisposed }) {
  const [confirming, setConfirming] = useState(null)
  const info = getFreshnessInfo(item)
  const cat = CATEGORIES[item.category] || CATEGORIES['other']
  const dateLabel = new Date(item.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  function handleAction(action) {
    if (confirming === action) {
      if (action === 'eaten') onEaten(item.id)
      else onDisposed(item.id)
      setConfirming(null)
    } else {
      setConfirming(action)
      setTimeout(() => setConfirming(null), 3000)
    }
  }

  return (
    <div
      className="item-card"
      style={{ borderLeftColor: info.color }}
    >
      <div className="item-card-header">
        <div className="item-card-title">
          <span className="item-emoji">{cat.emoji}</span>
          <div>
            <h3 className="item-name">{item.name}</h3>
            <p className="item-meta">{cat.label} · Added {dateLabel}</p>
          </div>
        </div>
        <div className="item-status-badge" style={{ color: info.color, backgroundColor: info.bgColor }}>
          {info.label}
        </div>
      </div>

      <div className="item-card-footer">
        <span className="item-days" style={{ color: info.color }}>
          {formatDaysRemaining(info.daysRemaining)}
        </span>
        <div className="item-actions">
          <button
            className={`action-btn eaten-btn ${confirming === 'eaten' ? 'confirming' : ''}`}
            onClick={() => handleAction('eaten')}
          >
            {confirming === 'eaten' ? 'Confirm?' : '🍽️ Eaten'}
          </button>
          <button
            className={`action-btn disposed-btn ${confirming === 'disposed' ? 'confirming' : ''}`}
            onClick={() => handleAction('disposed')}
          >
            {confirming === 'disposed' ? 'Confirm?' : '🗑️ Toss'}
          </button>
        </div>
      </div>
    </div>
  )
}

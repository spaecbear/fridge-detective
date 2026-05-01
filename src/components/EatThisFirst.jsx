import { getFreshnessInfo, generateNarrative, CATEGORIES } from '../utils/foodSafety'

function groupItems(items) {
  const today = [], thisWeek = [], later = [], expired = []

  items.forEach(item => {
    const { daysRemaining } = getFreshnessInfo(item)
    if (daysRemaining < 0) expired.push({ item, daysRemaining })
    else if (daysRemaining <= 1) today.push({ item, daysRemaining })
    else if (daysRemaining <= 7) thisWeek.push({ item, daysRemaining })
    else later.push({ item, daysRemaining })
  })

  // sort each group by urgency
  const byUrgency = (a, b) => a.daysRemaining - b.daysRemaining
  expired.sort(byUrgency)
  today.sort(byUrgency)
  thisWeek.sort(byUrgency)
  later.sort(byUrgency)

  return { expired, today, thisWeek, later }
}

function NarrativeItem({ item, daysRemaining, accent }) {
  const cat = CATEGORIES[item.category] || CATEGORIES['other']
  return (
    <div className="narrative-item" style={{ borderLeftColor: accent }}>
      <span className="narrative-emoji">{cat.emoji}</span>
      <p className="narrative-text">{generateNarrative(item, daysRemaining)}</p>
    </div>
  )
}

export default function EatThisFirst({ items, onNavigateAdd }) {
  if (items.length === 0) {
    return (
      <div className="screen">
        <header className="screen-header">
          <h1 className="screen-title">🍽️ Eat This First</h1>
        </header>
        <div className="empty-state">
          <div className="empty-icon">🕵️</div>
          <p className="empty-message">
            Nothing in the case file yet. Add some suspects and the Detective will
            tell you exactly what order to eat them in.
          </p>
          <button className="btn-primary" onClick={onNavigateAdd}>
            Add your first item
          </button>
        </div>
      </div>
    )
  }

  const { expired, today, thisWeek, later } = groupItems(items)

  return (
    <div className="screen">
      <header className="screen-header">
        <h1 className="screen-title">🍽️ Eat This First</h1>
        <p className="screen-subtitle">The Fridge Detective has spoken.</p>
      </header>

      {expired.length > 0 && (
        <section className="narrative-section">
          <div className="narrative-section-header toss-header">
            <span>💀</span>
            <div>
              <h2>Past the Point of No Return</h2>
              <p>These aren't suggestions. These are eulogies.</p>
            </div>
          </div>
          <div className="narrative-list">
            {expired.map(({ item, daysRemaining }) => (
              <NarrativeItem key={item.id} item={item} daysRemaining={daysRemaining} accent="#9ca3af" />
            ))}
          </div>
        </section>
      )}

      {today.length > 0 && (
        <section className="narrative-section">
          <div className="narrative-section-header urgent-header">
            <span>🚨</span>
            <div>
              <h2>Tonight — No Excuses</h2>
              <p>Drop everything. These need to happen today.</p>
            </div>
          </div>
          <div className="narrative-list">
            {today.map(({ item, daysRemaining }) => (
              <NarrativeItem key={item.id} item={item} daysRemaining={daysRemaining} accent="#f97316" />
            ))}
          </div>
        </section>
      )}

      {thisWeek.length > 0 && (
        <section className="narrative-section">
          <div className="narrative-section-header soon-header">
            <span>⏳</span>
            <div>
              <h2>This Week — A Word of Warning</h2>
              <p>You have time. Not unlimited time, but time.</p>
            </div>
          </div>
          <div className="narrative-list">
            {thisWeek.map(({ item, daysRemaining }) => (
              <NarrativeItem key={item.id} item={item} daysRemaining={daysRemaining} accent="#f59e0b" />
            ))}
          </div>
        </section>
      )}

      {later.length > 0 && (
        <section className="narrative-section">
          <div className="narrative-section-header fresh-header">
            <span>✅</span>
            <div>
              <h2>You've Got Time</h2>
              <p>These ones can wait. For now. Don't get comfortable.</p>
            </div>
          </div>
          <div className="narrative-list">
            {later.map(({ item, daysRemaining }) => (
              <NarrativeItem key={item.id} item={item} daysRemaining={daysRemaining} accent="#22c55e" />
            ))}
          </div>
        </section>
      )}

      <div className="detective-sign-off">
        <p>— The Fridge Detective 🕵️</p>
        <p className="sign-off-small">
          {items.length === 1
            ? "One item. You've got this."
            : `${items.length} suspects. Stay focused.`}
        </p>
      </div>
    </div>
  )
}

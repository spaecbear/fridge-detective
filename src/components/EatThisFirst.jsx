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
            No open cases. File a suspect and the Detective will brief you on
            exactly what to handle — and when.
          </p>
          <button className="btn-primary" onClick={onNavigateAdd}>
            Open a case file
          </button>
        </div>
      </div>
    )
  }

  const { expired, today, thisWeek, later } = groupItems(items)

  return (
    <div className="screen">
      <header className="screen-header">
        <h1 className="screen-title">📋 The Brief</h1>
        <p className="screen-subtitle">The Fridge Detective has spoken.</p>
      </header>

      {expired.length > 0 && (
        <section className="narrative-section">
          <div className="narrative-section-header toss-header">
            <span>🕰️</span>
            <div>
              <h2>Cold Cases</h2>
              <p>The window is closed. Evidence must be destroyed.</p>
            </div>
          </div>
          <div className="narrative-list">
            {expired.map(({ item, daysRemaining }) => (
              <NarrativeItem key={item.id} item={item} daysRemaining={daysRemaining} accent="#6b7280" />
            ))}
          </div>
        </section>
      )}

      {today.length > 0 && (
        <section className="narrative-section">
          <div className="narrative-section-header urgent-header">
            <span>🚨</span>
            <div>
              <h2>Persons of Interest</h2>
              <p>These need to be handled tonight. No exceptions.</p>
            </div>
          </div>
          <div className="narrative-list">
            {today.map(({ item, daysRemaining }) => (
              <NarrativeItem key={item.id} item={item} daysRemaining={daysRemaining} accent="#b91c1c" />
            ))}
          </div>
        </section>
      )}

      {thisWeek.length > 0 && (
        <section className="narrative-section">
          <div className="narrative-section-header soon-header">
            <span>🔍</span>
            <div>
              <h2>Under Investigation</h2>
              <p>The clock is running. Don't let these go cold.</p>
            </div>
          </div>
          <div className="narrative-list">
            {thisWeek.map(({ item, daysRemaining }) => (
              <NarrativeItem key={item.id} item={item} daysRemaining={daysRemaining} accent="#b45309" />
            ))}
          </div>
        </section>
      )}

      {later.length > 0 && (
        <section className="narrative-section">
          <div className="narrative-section-header fresh-header">
            <span>📁</span>
            <div>
              <h2>Active Files</h2>
              <p>Stable for now. The Detective is watching.</p>
            </div>
          </div>
          <div className="narrative-list">
            {later.map(({ item, daysRemaining }) => (
              <NarrativeItem key={item.id} item={item} daysRemaining={daysRemaining} accent="#15803d" />
            ))}
          </div>
        </section>
      )}

      <div className="detective-sign-off">
        <p>— The Fridge Detective 🕵️</p>
        <p className="sign-off-small">
          {items.length === 1
            ? "One open case. Close it clean."
            : `${items.length} open cases. Don't let them go cold.`}
        </p>
      </div>
    </div>
  )
}

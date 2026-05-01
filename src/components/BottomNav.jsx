export default function BottomNav({ tab, setTab, urgentCount }) {
  const tabs = [
    { id: 'fridge',   label: 'My Fridge',     icon: '🧊' },
    { id: 'add',      label: 'Add Item',       icon: '➕' },
    { id: 'eat-first', label: 'Eat This First', icon: '🍽️' },
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`bottom-nav-btn ${tab === t.id ? 'active' : ''}`}
          onClick={() => setTab(t.id)}
        >
          <span className="bottom-nav-icon">
            {t.icon}
            {t.id === 'fridge' && urgentCount > 0 && (
              <span className="nav-badge">{urgentCount}</span>
            )}
          </span>
          <span className="bottom-nav-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

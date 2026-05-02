export default function BottomNav({ tab, setTab, urgentCount }) {
  const tabs = [
    { id: 'fridge',    label: 'Case Files',  icon: '📁' },
    { id: 'add',       label: 'New Suspect', icon: '📋' },
    { id: 'eat-first', label: 'The Brief',   icon: '🔍' },
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

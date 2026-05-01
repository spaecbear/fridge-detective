export default function FridgeStats({ stats }) {
  const { recentEaten, recentTossed, wasteStreak } = stats
  const total = recentEaten + recentTossed
  const savedPct = total > 0 ? Math.round((recentEaten / total) * 100) : null

  function streakMessage() {
    if (recentEaten === 0 && recentTossed === 0) return "No history yet. The Detective is watching."
    if (wasteStreak === 0) return "You tossed something today. It happens. Allegedly."
    if (wasteStreak === 1) return "One day without waste. A promising start."
    if (wasteStreak < 5) return `${wasteStreak} days, no casualties. You're getting somewhere.`
    if (wasteStreak < 14) return `${wasteStreak}-day streak. The Detective is impressed.`
    return `${wasteStreak} days. You're basically a fridge whisperer at this point.`
  }

  return (
    <div className="stats-section">
      <h2 className="stats-title">📊 Fridge Report</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number" style={{ color: '#22c55e' }}>{recentEaten}</span>
          <span className="stat-label">eaten this week</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: '#ef4444' }}>{recentTossed}</span>
          <span className="stat-label">tossed this week</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: '#06b6d4' }}>
            {savedPct !== null ? `${savedPct}%` : '—'}
          </span>
          <span className="stat-label">save rate</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: '#a78bfa' }}>{wasteStreak}</span>
          <span className="stat-label">zero-waste streak</span>
        </div>
      </div>
      <p className="streak-message">{streakMessage()}</p>
    </div>
  )
}

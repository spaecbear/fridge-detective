export default function FridgeStats({ stats }) {
  const { recentEaten, recentTossed, wasteStreak } = stats
  const total = recentEaten + recentTossed
  const savedPct = total > 0 ? Math.round((recentEaten / total) * 100) : null

  function streakMessage() {
    if (recentEaten === 0 && recentTossed === 0) return "No closed cases yet. The Detective is watching."
    if (wasteStreak === 0) return "Evidence destroyed today. It happens. Even to the best detectives."
    if (wasteStreak === 1) return "One clean day. A promising start to your record."
    if (wasteStreak < 5) return `${wasteStreak} days, no evidence destroyed. You're building a case.`
    if (wasteStreak < 14) return `${wasteStreak}-day clean record. The Detective is impressed.`
    return `${wasteStreak} days. You're not just a detective — you're an institution.`
  }

  return (
    <div className="stats-section">
      <h2 className="stats-title">📋 Case Report</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number" style={{ color: '#4ade80' }}>{recentEaten}</span>
          <span className="stat-label">cases solved</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: '#f87171' }}>{recentTossed}</span>
          <span className="stat-label">evidence destroyed</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: '#fbbf24' }}>
            {savedPct !== null ? `${savedPct}%` : '—'}
          </span>
          <span className="stat-label">solve rate</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: '#c084fc' }}>{wasteStreak}</span>
          <span className="stat-label">clean record</span>
        </div>
      </div>
      <p className="streak-message">{streakMessage()}</p>
    </div>
  )
}

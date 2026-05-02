import { useState } from 'react'
import { CATEGORIES } from '../utils/foodSafety'

const FUZZY_DATES = [
  { label: 'Just now',    value: 'now' },
  { label: 'Today',       value: 'today' },
  { label: 'Yesterday',   value: 'yesterday' },
  { label: '2 days ago',  value: '2-days' },
  { label: '3 days ago',  value: '3-days' },
  { label: 'Custom date', value: 'custom' },
]

function resolveFuzzyDate(value, customDate) {
  const now = new Date()
  if (value === 'now') return now.toISOString()
  if (value === 'today') {
    now.setHours(12, 0, 0, 0)
    return now.toISOString()
  }
  if (value === 'yesterday') {
    now.setDate(now.getDate() - 1)
    now.setHours(12, 0, 0, 0)
    return now.toISOString()
  }
  if (value === '2-days') {
    now.setDate(now.getDate() - 2)
    now.setHours(12, 0, 0, 0)
    return now.toISOString()
  }
  if (value === '3-days') {
    now.setDate(now.getDate() - 3)
    now.setHours(12, 0, 0, 0)
    return now.toISOString()
  }
  if (value === 'custom' && customDate) {
    return new Date(customDate + 'T12:00:00').toISOString()
  }
  return now.toISOString()
}

export default function AddItem({ onAdd, onDone }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('other')
  const [fuzzyDate, setFuzzyDate] = useState('today')
  const [customDate, setCustomDate] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const cat = CATEGORIES[category]

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError("The item needs a name. Even 'mystery container' counts.")
      return
    }
    if (fuzzyDate === 'custom' && !customDate) {
      setError("You picked custom date but didn't actually pick a date. Classic.")
      return
    }
    setError('')
    const dateAdded = resolveFuzzyDate(fuzzyDate, customDate)
    onAdd({ name: name.trim(), category, dateAdded })
    setSubmitted(true)
    setTimeout(() => {
      setName('')
      setCategory('other')
      setFuzzyDate('today')
      setCustomDate('')
      setSubmitted(false)
      onDone()
    }, 1200)
  }

  if (submitted) {
    return (
      <div className="screen">
        <div className="success-state">
          <div className="success-icon">🗂️</div>
          <h2>Case file opened.</h2>
          <p>The Detective has been notified.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <header className="screen-header">
        <h1 className="screen-title">📋 Open a Case File</h1>
        <p className="screen-subtitle">What's lurking in your fridge?</p>
      </header>

      <form className="add-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label">What is it?</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Leftover tikka masala, Half a rotisserie chicken…"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={80}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">What kind of danger are we dealing with?</label>
          <div className="category-grid">
            {Object.entries(CATEGORIES).map(([key, val]) => (
              <button
                key={key}
                type="button"
                className={`category-chip ${category === key ? 'selected' : ''}`}
                onClick={() => setCategory(key)}
              >
                <span>{val.emoji}</span>
                <span>{val.label}</span>
              </button>
            ))}
          </div>
          {cat && (
            <p className="category-hint">
              Safe window: ~{cat.days} day{cat.days !== 1 ? 's' : ''} in the fridge.{' '}
              {cat.days <= 2 ? "Don't push it." : cat.days <= 4 ? "You've got some time." : "Fairly forgiving."}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">When was it made or opened?</label>
          <div className="fuzzy-date-grid">
            {FUZZY_DATES.map(fd => (
              <button
                key={fd.value}
                type="button"
                className={`fuzzy-chip ${fuzzyDate === fd.value ? 'selected' : ''}`}
                onClick={() => setFuzzyDate(fd.value)}
              >
                {fd.label}
              </button>
            ))}
          </div>
          {fuzzyDate === 'custom' && (
            <input
              className="form-input"
              type="date"
              value={customDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setCustomDate(e.target.value)}
              style={{ marginTop: '0.75rem' }}
            />
          )}
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary btn-full">
          File the Evidence 🕵️
        </button>
      </form>
    </div>
  )
}

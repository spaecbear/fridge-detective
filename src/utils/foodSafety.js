export const CATEGORIES = {
  'cooked-meat':     { label: 'Cooked Meat',        days: 4, emoji: '🥩' },
  'seafood':         { label: 'Seafood',             days: 2, emoji: '🐟' },
  'rice':            { label: 'Rice',                days: 2, emoji: '🍚' },
  'pasta':           { label: 'Pasta',               days: 5, emoji: '🍝' },
  'dairy':           { label: 'Dairy',               days: 7, emoji: '🧀' },
  'soup-stew':       { label: 'Soup / Stew',         days: 4, emoji: '🍲' },
  'leftovers-sauce': { label: 'Leftovers w/ Sauce',  days: 4, emoji: '🍛' },
  'produce':         { label: 'Produce',             days: 5, emoji: '🥦' },
  'other':           { label: 'Other',               days: 5, emoji: '📦' },
}

export function getFreshnessInfo(item) {
  const cat = CATEGORIES[item.category] || CATEGORIES['other']
  const safeWindow = cat.days
  const added = new Date(item.dateAdded)
  const now = new Date()
  const daysSince = (now - added) / (1000 * 60 * 60 * 24)
  const daysRemaining = safeWindow - daysSince

  let status, label, color, bgColor
  if (daysRemaining < 0) {
    status = 'toss';    label = '💀 Toss It';    color = '#9ca3af'; bgColor = 'rgba(156,163,175,0.12)'
  } else if (daysRemaining <= 1) {
    status = 'eat-today'; label = '🚨 Eat Today';  color = '#f97316'; bgColor = 'rgba(249,115,22,0.12)'
  } else if (daysRemaining <= safeWindow * 0.5) {
    status = 'eat-soon';  label = '⚠️ Eat Soon';   color = '#f59e0b'; bgColor = 'rgba(245,158,11,0.12)'
  } else {
    status = 'fresh';     label = '✅ Fresh';       color = '#22c55e'; bgColor = 'rgba(34,197,94,0.12)'
  }

  return { daysRemaining, daysSince, status, label, color, bgColor, safeWindow }
}

export function sortByUrgency(items) {
  return [...items].sort((a, b) => {
    const aInfo = getFreshnessInfo(a)
    const bInfo = getFreshnessInfo(b)
    return aInfo.daysRemaining - bInfo.daysRemaining
  })
}

export function formatDaysRemaining(daysRemaining) {
  if (daysRemaining < 0) {
    const over = Math.floor(Math.abs(daysRemaining))
    return over === 1 ? '1 day overdue' : `${over} days overdue`
  }
  if (daysRemaining < 1) return 'Expires today'
  if (daysRemaining < 2) return '1 day left'
  return `${Math.floor(daysRemaining)} days left`
}

const URGENT_LINES = [
  (name) => `${name} is basically begging to be eaten. Today.`,
  (name) => `${name} has entered its final form. Handle it.`,
  (name) => `${name} called. It's ready for its close-up. Eat it.`,
  (name) => `If ${name} were a text message, it would say "?????".`,
  (name) => `${name} is down to its last hours. Show some respect.`,
]

const SOON_LINES = [
  (name, day) => `${day}, ${name} would really appreciate the attention.`,
  (name, day) => `${day}: ${name} is quietly spiraling. Worth addressing.`,
  (name, day) => `${day} is your window for ${name}. Don't waste it.`,
  (name, day) => `${name} peaks ${day}. Don't let it hit the other side.`,
]

const LATER_LINES = [
  (name) => `${name} is comfortable. Doesn't mean you should ignore it.`,
  (name) => `${name} is fine for now. But "fine" has an expiration too.`,
  (name) => `${name} is living its best life. For now.`,
]

export function generateNarrative(item, daysRemaining) {
  const name = item.name

  if (daysRemaining < 0) {
    const days = Math.floor(Math.abs(daysRemaining))
    return days === 1
      ? `${name} missed its window by one day. It's a crime scene in there.`
      : `${name} expired ${days} days ago. We don't talk about this one.`
  }

  if (daysRemaining <= 1) {
    const idx = Math.abs(name.charCodeAt(0)) % URGENT_LINES.length
    return URGENT_LINES[idx](name)
  }

  if (daysRemaining <= 3) {
    const dayWord = Math.floor(daysRemaining) === 1 ? 'Tomorrow' : `In ${Math.floor(daysRemaining)} days`
    const idx = Math.abs(name.charCodeAt(0)) % SOON_LINES.length
    return SOON_LINES[idx](name, dayWord)
  }

  const idx = Math.abs(name.charCodeAt(0)) % LATER_LINES.length
  return LATER_LINES[idx](name)
}

export function getFridgeMood(items) {
  if (items.length === 0) return { emoji: '🧊', message: "Nothing to track. Either you're very efficient or the fridge is genuinely empty. Suspicious." }
  const tossCount = items.filter(i => getFreshnessInfo(i).status === 'toss').length
  const eatTodayCount = items.filter(i => getFreshnessInfo(i).status === 'eat-today').length
  const freshCount = items.filter(i => getFreshnessInfo(i).status === 'fresh').length

  if (tossCount > 2) return { emoji: '💀', message: "Your fridge is a crime scene. We're past intervention — this is cleanup." }
  if (tossCount > 0) return { emoji: '🚨', message: `${tossCount} item${tossCount > 1 ? 's' : ''} already past the point of no return. You know what to do.` }
  if (eatTodayCount > 1) return { emoji: '⏰', message: `${eatTodayCount} items need your attention today. The clock is not your friend right now.` }
  if (eatTodayCount === 1) return { emoji: '⏰', message: "One item is living on borrowed time. Deal with it today." }
  if (freshCount === items.length) return { emoji: '✨', message: "Honestly impressive. Everything's fresh. Are you even using this fridge?" }
  return { emoji: '🕵️', message: "Under control — for now. The Detective is watching." }
}

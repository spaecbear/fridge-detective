import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'fridge-detective-items'

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // storage full or unavailable — fail silently
  }
}

export function useFridgeData() {
  const [items, setItems] = useState(loadItems)

  useEffect(() => {
    saveItems(items)
  }, [items])

  const addItem = useCallback((data) => {
    const item = {
      id: generateId(),
      name: data.name.trim(),
      category: data.category,
      dateAdded: data.dateAdded,
      status: 'active',
      archivedAt: null,
    }
    setItems(prev => [item, ...prev])
    return item
  }, [])

  const archiveItem = useCallback((id, disposition) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: disposition, archivedAt: new Date().toISOString() }
          : item
      )
    )
  }, [])

  const deleteItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const activeItems = items.filter(i => i.status === 'active')
  const archivedItems = items.filter(i => i.status !== 'active')

  const now = new Date()
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)

  const recentEaten = archivedItems.filter(
    i => i.status === 'eaten' && new Date(i.archivedAt) >= weekAgo
  ).length

  const recentTossed = archivedItems.filter(
    i => i.status === 'disposed' && new Date(i.archivedAt) >= weekAgo
  ).length

  // Zero-waste streak: consecutive days (from today going back) with no disposals
  const disposalDays = new Set(
    archivedItems
      .filter(i => i.status === 'disposed')
      .map(i => new Date(i.archivedAt).toDateString())
  )

  // Only count streak if the user has any history at all
  let wasteStreak = 0
  if (archivedItems.length > 0) {
    if (disposalDays.has(now.toDateString())) {
      wasteStreak = 0
    } else {
      let streak = 0
      const checkDate = new Date(now)
      while (!disposalDays.has(checkDate.toDateString())) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
        if (streak > 365) break
      }
      wasteStreak = streak
    }
  }

  return {
    items,
    activeItems,
    archivedItems,
    addItem,
    archiveItem,
    deleteItem,
    stats: { recentEaten, recentTossed, wasteStreak },
  }
}

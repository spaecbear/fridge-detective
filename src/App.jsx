import { useState } from 'react'
import { useFridgeData } from './hooks/useFridgeData'
import { getFreshnessInfo } from './utils/foodSafety'
import BottomNav from './components/BottomNav'
import FridgeDashboard from './components/FridgeDashboard'
import AddItem from './components/AddItem'
import EatThisFirst from './components/EatThisFirst'

export default function App() {
  const [tab, setTab] = useState('fridge')
  const { activeItems, addItem, archiveItem, stats } = useFridgeData()

  const urgentCount = activeItems.filter(i => {
    const { status } = getFreshnessInfo(i)
    return status === 'eat-today' || status === 'toss'
  }).length

  function handleAdd(data) {
    addItem(data)
  }

  function handleAddDone() {
    setTab('fridge')
  }

  return (
    <div className="app">
      <main className="main-content">
        {tab === 'fridge' && (
          <FridgeDashboard
            items={activeItems}
            onEaten={(id) => archiveItem(id, 'eaten')}
            onDisposed={(id) => archiveItem(id, 'disposed')}
            stats={stats}
            onAddItem={() => setTab('add')}
          />
        )}
        {tab === 'add' && (
          <AddItem onAdd={handleAdd} onDone={handleAddDone} />
        )}
        {tab === 'eat-first' && (
          <EatThisFirst
            items={activeItems}
            onNavigateAdd={() => setTab('add')}
          />
        )}
      </main>
      <BottomNav tab={tab} setTab={setTab} urgentCount={urgentCount} />
    </div>
  )
}

import { motion } from 'framer-motion'
import type { Screen } from '../types'

const STEPS: { screen: Screen; label: string }[] = [
  { screen: 'setup', label: 'Setup' },
  { screen: 'reveal', label: 'Onthullen' },
  { screen: 'discussion', label: 'Discussie' },
  { screen: 'voting', label: 'Stemmen' },
  { screen: 'results', label: 'Resultaat' },
]

export function ProgressSteps({ current }: { current: Screen }) {
  const currentIndex = STEPS.findIndex((s) => s.screen === current)

  return (
    <div className="mb-6 flex items-center justify-center gap-1.5">
      {STEPS.map((step, i) => {
        const isActive = i === currentIndex
        const isDone = i < currentIndex
        return (
          <div key={step.screen} className="flex items-center gap-1.5">
            <motion.div
              className={`h-2 rounded-full ${
                isActive ? 'bg-violet-600' : isDone ? 'bg-violet-300' : 'bg-violet-100'
              }`}
              initial={false}
              animate={{ width: isActive ? 22 : 8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          </div>
        )
      })}
    </div>
  )
}

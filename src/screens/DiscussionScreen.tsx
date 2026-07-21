import { useEffect, useRef, useState } from 'react'
import { CATEGORY_LABELS } from '../data/wordCategories'
import type { GameConfig, RoundData } from '../types'
import { Button } from '../components/Button'

interface DiscussionScreenProps {
  round: RoundData
  config: GameConfig
  onStartVoting: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function DiscussionScreen({ round, config, onStartVoting }: DiscussionScreenProps) {
  const [secondsLeft, setSecondsLeft] = useState(config.discussionTimerSeconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [running])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 text-center">
      <div>
        <p className="text-sm uppercase tracking-wide text-violet-500">Categorie</p>
        <h2 className="mt-1 text-3xl font-bold text-slate-900">
          {CATEGORY_LABELS[round.categoryUsed]}
        </h2>
        <p className="mt-2 text-slate-500">Bespreek het woord zonder het te verklappen</p>
      </div>

      {config.discussionTimerEnabled && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl font-mono font-bold text-violet-700">
            {formatTime(secondsLeft)}
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="w-auto px-6"
              onClick={() => setRunning((r) => !r)}
            >
              {running ? 'Pauze' : secondsLeft === 0 ? 'Opnieuw' : 'Start'}
            </Button>
            <Button
              variant="secondary"
              className="w-auto px-6"
              onClick={() => {
                setRunning(false)
                setSecondsLeft(config.discussionTimerSeconds)
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      )}

      <Button onClick={onStartVoting}>Start stemronde</Button>
    </div>
  )
}

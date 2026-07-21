import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CATEGORY_LABELS } from '../data/wordCategories'
import type { GameConfig, Player, RoundData } from '../types'
import { Button } from '../components/Button'

interface DiscussionScreenProps {
  round: RoundData
  config: GameConfig
  players: Player[]
  startingPlayerId: string | null
  onStartVoting: () => void
}

const URGENT_THRESHOLD = 10

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function DiscussionScreen({
  round,
  config,
  players,
  startingPlayerId,
  onStartVoting,
}: DiscussionScreenProps) {
  const [secondsLeft, setSecondsLeft] = useState(config.discussionTimerSeconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const startingPlayer = players.find((p) => p.id === startingPlayerId)
  const isUrgent = running && secondsLeft <= URGENT_THRESHOLD && secondsLeft > 0

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

      {startingPlayer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="rounded-2xl bg-amber-100 px-5 py-3 text-amber-800"
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 15, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-block"
          >
            🎲
          </motion.span>{' '}
          <span className="font-semibold">{startingPlayer.name}</span> begint met discussiëren!
        </motion.div>
      )}

      {config.discussionTimerEnabled && (
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={isUrgent ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={isUrgent ? { duration: 1, repeat: Infinity } : {}}
            className={`text-6xl font-mono font-bold transition-colors ${
              isUrgent ? 'text-rose-600' : 'text-violet-700'
            }`}
          >
            {formatTime(secondsLeft)}
          </motion.div>
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

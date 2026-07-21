import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Player } from '../types'
import { PassDeviceCard } from '../components/PassDeviceCard'

interface VotingScreenProps {
  players: Player[]
  currentVoterIndex: number
  onVote: (votedForId: string) => void
  onPrevious: () => void
}

export function VotingScreen({ players, currentVoterIndex, onVote, onPrevious }: VotingScreenProps) {
  const [revealed, setRevealed] = useState(false)
  const voter = players[currentVoterIndex]

  useEffect(() => {
    setRevealed(false)
  }, [currentVoterIndex])

  if (!voter) return null

  return (
    <div className="flex min-h-[70vh] flex-col justify-center gap-8">
      <p className="text-center text-sm text-slate-400">
        Stem {currentVoterIndex + 1} van {players.length}
      </p>

      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <PassDeviceCard
              playerName={voter.name}
              prompt="Geef de telefoon door aan"
              onReveal={() => setRevealed(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="vote"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-center text-2xl font-bold text-slate-900">
              Op wie stemt <span className="text-violet-700">{voter.name}</span>?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {players.map((p, i) => (
                <motion.button
                  key={p.id}
                  onClick={() => onVote(p.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.03 }}
                  className="rounded-2xl bg-white px-4 py-6 text-lg font-semibold text-slate-800 shadow-sm hover:bg-violet-50"
                >
                  {p.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!revealed && currentVoterIndex > 0 && (
        <button
          onClick={onPrevious}
          className="text-sm text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
        >
          ← Vorige stem (bij vergissing)
        </button>
      )}
    </div>
  )
}

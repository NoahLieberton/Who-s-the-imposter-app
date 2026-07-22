import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Player, Vote } from '../types'
import { PassDeviceCard } from '../components/PassDeviceCard'
import { StopRoundButton } from '../components/StopRoundButton'
import { playSelect } from '../lib/sound'

interface VotingScreenProps {
  players: Player[]
  currentVoterIndex: number
  numImposters: number
  votes: Vote[]
  onVote: (votedForId: string) => void
  onPrevious: () => void
  onBackToDiscussion: () => void
  onStop: () => void
}

export function VotingScreen({
  players,
  currentVoterIndex,
  numImposters,
  votes,
  onVote,
  onPrevious,
  onBackToDiscussion,
  onStop,
}: VotingScreenProps) {
  const [revealed, setRevealed] = useState(false)
  const voter = players[currentVoterIndex]
  const votesByVoter = voter ? votes.filter((v) => v.voterId === voter.id) : []
  const votedIds = new Set(votesByVoter.map((v) => v.votedForId))
  const suspectSlot = votesByVoter.length + 1

  useEffect(() => {
    setRevealed(false)
  }, [currentVoterIndex])

  if (!voter) return null

  return (
    <div className="flex min-h-[70vh] flex-col justify-center gap-8">
      <p className="text-center text-sm text-slate-400">
        Stem {currentVoterIndex + 1} van {players.length}
        {numImposters > 1 && ` — verdachte ${suspectSlot} van ${numImposters}`}
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
              {players.map((p, i) => {
                const alreadyPicked = votedIds.has(p.id)
                return (
                  <motion.button
                    key={p.id}
                    disabled={alreadyPicked}
                    onClick={() => {
                      if (alreadyPicked) return
                      playSelect()
                      onVote(p.id)
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    whileTap={alreadyPicked ? undefined : { scale: 0.93 }}
                    whileHover={alreadyPicked ? undefined : { scale: 1.03 }}
                    className={`rounded-2xl px-4 py-6 text-lg font-semibold shadow-sm ${
                      alreadyPicked
                        ? 'cursor-not-allowed bg-violet-100 text-violet-400'
                        : 'bg-white text-slate-800 hover:bg-violet-50'
                    }`}
                  >
                    {p.name}
                    {alreadyPicked ? ' ✓' : ''}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!revealed && (votesByVoter.length > 0 || currentVoterIndex > 0) && (
        <button
          onClick={onPrevious}
          className="text-sm text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
        >
          ← Vorige stem (bij vergissing)
        </button>
      )}

      {!revealed && currentVoterIndex === 0 && votesByVoter.length === 0 && (
        <button
          onClick={onBackToDiscussion}
          className="text-sm text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
        >
          ← Terug naar discussie
        </button>
      )}

      <div className="flex justify-center">
        <StopRoundButton onStop={onStop} />
      </div>
    </div>
  )
}

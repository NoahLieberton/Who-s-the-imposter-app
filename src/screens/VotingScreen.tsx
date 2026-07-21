import { useEffect, useState } from 'react'
import type { Player } from '../types'
import { PassDeviceCard } from '../components/PassDeviceCard'

interface VotingScreenProps {
  players: Player[]
  currentVoterIndex: number
  onVote: (votedForId: string) => void
}

export function VotingScreen({ players, currentVoterIndex, onVote }: VotingScreenProps) {
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

      {!revealed ? (
        <PassDeviceCard
          playerName={voter.name}
          prompt="Geef de telefoon door aan"
          onReveal={() => setRevealed(true)}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            Op wie stemt <span className="text-violet-700">{voter.name}</span>?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {players.map((p) => (
              <button
                key={p.id}
                onClick={() => onVote(p.id)}
                className="rounded-2xl bg-white px-4 py-6 text-lg font-semibold text-slate-800 shadow-sm transition active:scale-95 hover:bg-violet-50"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

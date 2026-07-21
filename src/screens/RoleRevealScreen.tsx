import { useEffect, useState } from 'react'
import { CATEGORY_LABELS } from '../data/wordCategories'
import type { Player, RoundData } from '../types'
import { Button } from '../components/Button'
import { PassDeviceCard } from '../components/PassDeviceCard'

interface RoleRevealScreenProps {
  players: Player[]
  round: RoundData
  currentRevealIndex: number
  onAdvance: () => void
}

export function RoleRevealScreen({
  players,
  round,
  currentRevealIndex,
  onAdvance,
}: RoleRevealScreenProps) {
  const [revealed, setRevealed] = useState(false)
  const player = players[currentRevealIndex]

  useEffect(() => {
    setRevealed(false)
  }, [currentRevealIndex])

  if (!player) return null

  const isImposter = round.imposterIds.includes(player.id)

  return (
    <div className="flex min-h-[70vh] flex-col justify-center gap-8">
      <p className="text-center text-sm text-slate-400">
        Speler {currentRevealIndex + 1} van {players.length}
      </p>

      {!revealed ? (
        <PassDeviceCard
          playerName={player.name}
          prompt="Geef de telefoon door aan"
          onReveal={() => setRevealed(true)}
        />
      ) : (
        <div className="flex flex-col items-center gap-6 text-center">
          {isImposter ? (
            <div className="rounded-3xl bg-rose-600 px-6 py-10 text-white shadow-lg">
              <p className="text-5xl">🕵️</p>
              <h2 className="mt-4 text-2xl font-extrabold">Jij bent de IMPOSTER!</h2>
              <p className="mt-2 text-rose-100">
                Categorie: <span className="font-semibold">{CATEGORY_LABELS[round.categoryUsed]}</span>
              </p>
              <p className="mt-1 text-rose-100">
                Hint: <span className="font-semibold">{round.hintWord}</span>
              </p>
              <p className="mt-2 text-sm text-rose-100">
                Jij kent het echte woord niet. Doe alsof en probeer niet op te vallen!
              </p>
            </div>
          ) : (
            <div className="rounded-3xl bg-violet-600 px-6 py-10 text-white shadow-lg">
              <p className="text-sm uppercase tracking-wide text-violet-200">
                {CATEGORY_LABELS[round.categoryUsed]}
              </p>
              <h2 className="mt-2 text-3xl font-extrabold">{round.secretWord}</h2>
              <p className="mt-3 text-sm text-violet-100">Onthoud dit woord, maar zeg het niet hardop!</p>
            </div>
          )}

          <Button
            onClick={() => {
              setRevealed(false)
              onAdvance()
            }}
          >
            Verberg &amp; geef door
          </Button>
        </div>
      )}
    </div>
  )
}

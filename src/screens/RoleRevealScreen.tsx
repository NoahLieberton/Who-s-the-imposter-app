import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CATEGORY_LABELS } from '../data/wordCategories'
import type { Player, RoundData } from '../types'
import { Button } from '../components/Button'
import { PassDeviceCard } from '../components/PassDeviceCard'
import { StopRoundButton } from '../components/StopRoundButton'
import { playFlip } from '../lib/sound'

interface RoleRevealScreenProps {
  players: Player[]
  round: RoundData
  currentRevealIndex: number
  onAdvance: () => void
  onPrevious: () => void
  onStop: () => void
}

export function RoleRevealScreen({
  players,
  round,
  currentRevealIndex,
  onAdvance,
  onPrevious,
  onStop,
}: RoleRevealScreenProps) {
  const [revealed, setRevealed] = useState(false)
  // True for the whole 0.6s flip, in either direction. Gates the "previous
  // player" control so it can't fire while a close animation still has a
  // pending onAdvance — tapping it mid-flip would race the index change
  // and could flash the next player's role before the card finishes closing.
  const [animating, setAnimating] = useState(false)
  // Framer Motion fires onAnimationComplete once on mount even when nothing
  // actually animated (the "closed" resting state matches the initial
  // render). Without this guard that phantom event would call onAdvance()
  // immediately, silently skipping straight to the next player. Only a
  // close that follows a real open should ever trigger onAdvance.
  const hasOpenedRef = useRef(false)
  const player = players[currentRevealIndex]

  useEffect(() => {
    setRevealed(false)
    hasOpenedRef.current = false
  }, [currentRevealIndex])

  if (!player) return null

  const isImposter = round.imposterIds.includes(player.id)

  function handleReveal() {
    playFlip()
    setAnimating(true)
    setRevealed(true)
    hasOpenedRef.current = true
  }

  function handleHide() {
    playFlip()
    setAnimating(true)
    setRevealed(false)
  }

  return (
    <div className="flex min-h-[70vh] flex-col justify-center gap-8">
      <p className="text-center text-sm text-slate-400">
        Speler {currentRevealIndex + 1} van {players.length}
      </p>

      <div style={{ perspective: 1200 }}>
        <motion.div
          className="relative min-h-[380px] w-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: revealed ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          onAnimationComplete={() => {
            // Only advance once the card has fully flipped back to the cover
            // side after a genuine reveal — this keeps the outgoing player's
            // role on screen for the entire closing animation instead of
            // swapping to the next player's (possibly imposter) content
            // mid-flip, and ignores the phantom mount-time completion event.
            setAnimating(false)
            if (!revealed && hasOpenedRef.current) {
              hasOpenedRef.current = false
              onAdvance()
            }
          }}
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <PassDeviceCard
              playerName={player.name}
              prompt="Geef de telefoon door aan"
              onReveal={handleReveal}
            />
          </div>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {isImposter ? (
              <div className="rounded-3xl bg-rose-600 px-6 py-10 text-white shadow-lg">
                <p className="text-5xl">🕵️</p>
                <h2 className="mt-4 text-2xl font-extrabold">Jij bent de IMPOSTER!</h2>
                <p className="mt-2 text-rose-100">
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
                <p className="mt-3 text-sm text-violet-100">
                  Onthoud dit woord, maar zeg het niet hardop!
                </p>
              </div>
            )}

            <Button onClick={handleHide}>Verberg &amp; geef door</Button>
          </div>
        </motion.div>
      </div>

      {!revealed && !animating && currentRevealIndex > 0 && (
        <button
          onClick={onPrevious}
          className="text-sm text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
        >
          ← Vorige speler (bij vergissing)
        </button>
      )}

      <div className="flex justify-center">
        <StopRoundButton onStop={onStop} />
      </div>
    </div>
  )
}

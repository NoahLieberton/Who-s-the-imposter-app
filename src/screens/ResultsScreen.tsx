import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CATEGORY_LABELS } from '../data/wordCategories'
import {
  CREW_WIN_POINTS,
  IMPOSTER_WIN_POINTS,
  computeResult,
  getMostVotedPlayerIds,
  roundPointsFor,
  tallyVotes,
} from '../game/gameLogic'
import type { Player, RoundData, Vote } from '../types'
import { Button } from '../components/Button'
import { Confetti } from '../components/Confetti'
import { playLose, playWin } from '../lib/sound'

interface ResultsScreenProps {
  players: Player[]
  round: RoundData
  votes: Vote[]
  score: Record<string, number>
  onPlayAgain: () => void
  onNewGame: () => void
}

function nameFor(players: Player[], id: string): string {
  return players.find((p) => p.id === id)?.name ?? '?'
}

export function ResultsScreen({
  players,
  round,
  votes,
  score,
  onPlayAgain,
  onNewGame,
}: ResultsScreenProps) {
  const tally = tallyVotes(votes)
  const mostVotedIds = getMostVotedPlayerIds(tally)
  const { correct, tie } = computeResult(round, mostVotedIds)
  const rankedPlayers = [...players].sort(
    (a, b) => (score[b.id] ?? 0) - (score[a.id] ?? 0),
  )
  const [confirmingNewGame, setConfirmingNewGame] = useState(false)

  useEffect(() => {
    if (correct) playWin()
    else playLose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={
          correct
            ? { opacity: 1, scale: 1 }
            : tie
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: 1, x: [0, -10, 10, -8, 8, -4, 4, 0] }
        }
        transition={{ duration: correct || tie ? 0.4 : 0.6, ease: 'easeOut' }}
        className={`relative overflow-hidden rounded-3xl px-6 py-8 text-center text-white shadow-lg ${
          tie ? 'bg-slate-500' : correct ? 'bg-emerald-600' : 'bg-rose-600'
        }`}
      >
        {correct && <Confetti />}
        <motion.p
          className="text-5xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.15 }}
        >
          {tie ? '🤔' : correct ? '🎉' : '😱'}
        </motion.p>
        <h2 className="mt-3 text-2xl font-extrabold">
          {tie ? 'Onbeslist!' : correct ? 'De imposter is gepakt!' : 'De imposter is ontsnapt!'}
        </h2>
        <p className="mt-2 text-sm text-white/90">
          {tie
            ? `Geen duidelijke meerderheid. Crew-leden die zelf op een imposter stemden krijgen alsnog +${CREW_WIN_POINTS} punt, de imposter(s) ontsnappen met +${IMPOSTER_WIN_POINTS}.`
            : correct
              ? `De meest gestemde speler was echt de imposter. Alleen wie daar zelf op stemde krijgt +${CREW_WIN_POINTS} punt.`
              : `De meest gestemde speler was onschuldig. Crew-leden die wel goed gokten krijgen nog steeds +${CREW_WIN_POINTS}, de niet-gepakte imposter(s) krijgen +${IMPOSTER_WIN_POINTS}.`}
        </p>
      </motion.div>

      {[
        {
          label: 'Het geheime woord was',
          labelClass: 'text-violet-500',
          content: (
            <>
              <p className="mt-1 text-2xl font-bold text-slate-900">{round.secretWord}</p>
              <p className="text-sm text-slate-500">{CATEGORY_LABELS[round.categoryUsed]}</p>
            </>
          ),
        },
        {
          label: round.imposterIds.length > 1 ? 'De imposters waren' : 'De imposter was',
          labelClass: 'text-rose-500',
          content: (
            <p className="mt-1 text-xl font-bold text-slate-900">
              {round.imposterIds.map((id) => nameFor(players, id)).join(', ')}
            </p>
          ),
        },
        {
          label: 'Stemmen',
          labelClass: 'text-violet-500',
          content: (
            <ul className="mt-2 flex flex-col gap-1">
              {players.map((p) => (
                <li key={p.id} className="flex justify-between text-slate-700">
                  <span>{p.name}</span>
                  <span className="font-semibold">{tally[p.id] ?? 0}</span>
                </li>
              ))}
            </ul>
          ),
        },
        {
          label: 'Stand (totaalscore)',
          labelClass: 'text-emerald-600',
          content: (
            <ul className="mt-2 flex flex-col gap-1">
              {rankedPlayers.map((p, i) => {
                const points = roundPointsFor(p, round, mostVotedIds, tie, votes)
                return (
                  <li key={p.id} className="flex items-center justify-between text-slate-700">
                    <span>
                      {i === 0 && (score[p.id] ?? 0) > 0 ? '🏆 ' : ''}
                      {p.name}
                    </span>
                    <span className="flex items-center gap-2">
                      {points > 0 && (
                        <span className="text-xs font-semibold text-emerald-600">+{points}</span>
                      )}
                      <span className="font-bold text-slate-900">{score[p.id] ?? 0}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          ),
        },
      ].map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
          className="rounded-2xl bg-white p-5 shadow-sm"
        >
          <p className={`text-sm uppercase tracking-wide ${card.labelClass}`}>{card.label}</p>
          {card.content}
        </motion.div>
      ))}

      <div className="flex flex-col gap-3">
        <Button onClick={onPlayAgain}>Nieuwe ronde (zelfde spelers)</Button>
        <AnimatePresence mode="wait" initial={false}>
          {!confirmingNewGame ? (
            <motion.div
              key="ask"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Button variant="secondary" onClick={() => setConfirmingNewGame(true)}>
                Nieuw spel
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-2 rounded-2xl border-2 border-rose-100 bg-rose-50 p-4"
            >
              <p className="text-center text-sm text-rose-700">
                Weet je het zeker? Je verliest de huidige score.
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => setConfirmingNewGame(false)}>
                  Annuleren
                </Button>
                <Button variant="danger" className="flex-1" onClick={onNewGame}>
                  Ja, nieuw spel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

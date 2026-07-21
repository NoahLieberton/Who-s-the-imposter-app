import { motion } from 'framer-motion'
import { CATEGORY_LABELS } from '../data/wordCategories'
import { computeResult, getMostVotedPlayerIds, tallyVotes } from '../game/gameLogic'
import type { Player, RoundData, Vote } from '../types'
import { Button } from '../components/Button'
import { Confetti } from '../components/Confetti'

interface ResultsScreenProps {
  players: Player[]
  round: RoundData
  votes: Vote[]
  onPlayAgain: () => void
  onNewGame: () => void
}

function nameFor(players: Player[], id: string): string {
  return players.find((p) => p.id === id)?.name ?? '?'
}

export function ResultsScreen({ players, round, votes, onPlayAgain, onNewGame }: ResultsScreenProps) {
  const tally = tallyVotes(votes)
  const mostVotedIds = getMostVotedPlayerIds(tally)
  const { correct, tie } = computeResult(round, mostVotedIds)

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
        <Button variant="secondary" onClick={onNewGame}>
          Nieuw spel
        </Button>
      </div>
    </div>
  )
}

import { CATEGORY_LABELS } from '../data/wordCategories'
import { computeResult, getMostVotedPlayerIds, tallyVotes } from '../game/gameLogic'
import type { Player, RoundData, Vote } from '../types'
import { Button } from '../components/Button'

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
      <div
        className={`rounded-3xl px-6 py-8 text-center text-white shadow-lg ${
          tie ? 'bg-slate-500' : correct ? 'bg-emerald-600' : 'bg-rose-600'
        }`}
      >
        <p className="text-5xl">{tie ? '🤔' : correct ? '🎉' : '😱'}</p>
        <h2 className="mt-3 text-2xl font-extrabold">
          {tie ? 'Onbeslist!' : correct ? 'De imposter is gepakt!' : 'De imposter is ontsnapt!'}
        </h2>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm uppercase tracking-wide text-violet-500">Het geheime woord was</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{round.secretWord}</p>
        <p className="text-sm text-slate-500">{CATEGORY_LABELS[round.categoryUsed]}</p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm uppercase tracking-wide text-rose-500">
          {round.imposterIds.length > 1 ? 'De imposters waren' : 'De imposter was'}
        </p>
        <p className="mt-1 text-xl font-bold text-slate-900">
          {round.imposterIds.map((id) => nameFor(players, id)).join(', ')}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm uppercase tracking-wide text-violet-500">Stemmen</p>
        <ul className="mt-2 flex flex-col gap-1">
          {players.map((p) => (
            <li key={p.id} className="flex justify-between text-slate-700">
              <span>{p.name}</span>
              <span className="font-semibold">{tally[p.id] ?? 0}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={onPlayAgain}>Nieuwe ronde (zelfde spelers)</Button>
        <Button variant="secondary" onClick={onNewGame}>
          Nieuw spel
        </Button>
      </div>
    </div>
  )
}

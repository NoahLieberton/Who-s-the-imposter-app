import { useState } from 'react'
import type { ManualResult, Player, RoundData } from '../types'
import { Button } from '../components/Button'
import { StopRoundButton } from '../components/StopRoundButton'

interface ManualResultScreenProps {
  players: Player[]
  round: RoundData
  onSubmit: (result: ManualResult) => void
  onBackToDiscussion: () => void
  onStop: () => void
}

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

export function ManualResultScreen({
  players,
  round,
  onSubmit,
  onBackToDiscussion,
  onStop,
}: ManualResultScreenProps) {
  const [correctVoteCounts, setCorrectVoteCounts] = useState<Record<string, number>>({})
  const [caughtImposterIds, setCaughtImposterIds] = useState<string[]>([])

  const imposters = players.filter((p) => round.imposterIds.includes(p.id))
  const crew = players.filter((p) => !round.imposterIds.includes(p.id))
  const maxGuesses = round.imposterIds.length

  function adjustCount(playerId: string, delta: number) {
    setCorrectVoteCounts((counts) => {
      const next = Math.max(0, Math.min(maxGuesses, (counts[playerId] ?? 0) + delta))
      return { ...counts, [playerId]: next }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Vul de uitslag in</h2>
        <p className="mt-2 text-sm text-slate-500">
          Jullie stemden in het echt (bijv. door te wijzen). Vul hieronder in wat er gebeurde.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm uppercase tracking-wide text-rose-500">
          {imposters.length > 1 ? 'Welke imposters zijn gepakt?' : 'Is de imposter gepakt?'}
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {imposters.map((p) => (
            <label
              key={p.id}
              className="flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3"
            >
              <span className="font-medium text-slate-800">{p.name}</span>
              <input
                type="checkbox"
                checked={caughtImposterIds.includes(p.id)}
                onChange={() => setCaughtImposterIds((ids) => toggle(ids, p.id))}
                className="h-6 w-6 accent-rose-600"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm uppercase tracking-wide text-violet-500">Wie stemde goed?</p>
        <p className="mt-1 text-xs text-slate-400">
          {maxGuesses > 1
            ? `Hoeveel van hun stemmen waren op een echte imposter (max ${maxGuesses})?`
            : 'Wie wees naar de echte imposter?'}
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {crew.map((p) =>
            maxGuesses > 1 ? (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-violet-50 px-4 py-3"
              >
                <span className="font-medium text-slate-800">{p.name}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => adjustCount(p.id, -1)}
                    disabled={(correctVoteCounts[p.id] ?? 0) === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-violet-600 shadow-sm disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-bold text-slate-900">
                    {correctVoteCounts[p.id] ?? 0}
                    <span className="text-xs font-normal text-slate-400"> /{maxGuesses}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustCount(p.id, 1)}
                    disabled={(correctVoteCounts[p.id] ?? 0) === maxGuesses}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-violet-600 shadow-sm disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <label
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-violet-50 px-4 py-3"
              >
                <span className="font-medium text-slate-800">{p.name}</span>
                <input
                  type="checkbox"
                  checked={(correctVoteCounts[p.id] ?? 0) > 0}
                  onChange={() =>
                    setCorrectVoteCounts((counts) => ({
                      ...counts,
                      [p.id]: (counts[p.id] ?? 0) > 0 ? 0 : 1,
                    }))
                  }
                  className="h-6 w-6 accent-violet-600"
                />
              </label>
            ),
          )}
        </div>
      </div>

      <Button onClick={() => onSubmit({ correctVoteCounts, caughtImposterIds })}>
        Bekijk resultaat
      </Button>

      <button
        onClick={onBackToDiscussion}
        className="text-sm text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
      >
        ← Terug naar discussie
      </button>

      <div className="flex justify-center">
        <StopRoundButton onStop={onStop} />
      </div>
    </div>
  )
}

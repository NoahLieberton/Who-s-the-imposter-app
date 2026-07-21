import type { Player } from '../types'
import { Button } from '../components/Button'

interface PlayerNamesScreenProps {
  players: Player[]
  onChange: (players: Player[]) => void
  onBack: () => void
  onNext: () => void
}

export function PlayerNamesScreen({ players, onChange, onBack, onNext }: PlayerNamesScreenProps) {
  function updateName(id: string, name: string) {
    onChange(players.map((p) => (p.id === id ? { ...p, name } : p)))
  }

  function handleStart() {
    onChange(
      players.map((p, i) => ({ ...p, name: p.name.trim() === '' ? `Speler ${i + 1}` : p.name.trim() })),
    )
    onNext()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-violet-700">Namen invoeren</h1>
        <p className="mt-2 text-slate-500">Laat leeg voor de standaardnaam</p>
      </div>

      <div className="flex flex-col gap-3">
        {players.map((player, i) => (
          <input
            key={player.id}
            value={player.name}
            placeholder={`Speler ${i + 1}`}
            onChange={(e) => updateName(player.id, e.target.value)}
            className="rounded-xl border-2 border-violet-100 bg-white px-4 py-3 text-lg outline-none focus:border-violet-400"
          />
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack}>
          Terug
        </Button>
        <Button onClick={handleStart}>Start ronde</Button>
      </div>
    </div>
  )
}

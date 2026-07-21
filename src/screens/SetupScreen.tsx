import { CATEGORY_LABELS } from '../data/wordCategories'
import type { GameConfig } from '../types'
import { Button } from '../components/Button'

interface SetupScreenProps {
  config: GameConfig
  onChange: (config: Partial<GameConfig>) => void
  onNext: () => void
}

const MIN_PLAYERS = 3
const MAX_PLAYERS = 10

export function SetupScreen({ config, onChange, onNext }: SetupScreenProps) {
  const maxImposters = Math.max(1, config.numPlayers - 1)

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-violet-700">Who's the Imposter</h1>
        <p className="mt-2 text-slate-500">Stel je spel in en geef de telefoon door</p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">Aantal spelers</span>
          <span className="text-2xl font-bold text-violet-700">{config.numPlayers}</span>
        </div>
        <input
          type="range"
          min={MIN_PLAYERS}
          max={MAX_PLAYERS}
          value={config.numPlayers}
          onChange={(e) => {
            const numPlayers = Number(e.target.value)
            const numImposters = Math.min(config.numImposters, numPlayers - 1)
            onChange({ numPlayers, numImposters })
          }}
          className="mt-3 w-full accent-violet-600"
        />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">Aantal imposters</span>
          <span className="text-2xl font-bold text-rose-600">{config.numImposters}</span>
        </div>
        <input
          type="range"
          min={1}
          max={maxImposters}
          value={config.numImposters}
          onChange={(e) => onChange({ numImposters: Number(e.target.value) })}
          className="mt-3 w-full accent-rose-600"
        />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <span className="font-semibold text-slate-700">Categorie</span>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => onChange({ category: 'random' })}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
              config.category === 'random'
                ? 'bg-violet-600 text-white'
                : 'bg-violet-50 text-violet-700'
            }`}
          >
            🎲 Willekeurig
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => onChange({ category: key as GameConfig['category'] })}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                config.category === key
                  ? 'bg-violet-600 text-white'
                  : 'bg-violet-50 text-violet-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <label className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">Discussie-timer</span>
          <input
            type="checkbox"
            checked={config.discussionTimerEnabled}
            onChange={(e) => onChange({ discussionTimerEnabled: e.target.checked })}
            className="h-6 w-6 accent-violet-600"
          />
        </label>
        {config.discussionTimerEnabled && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-slate-500">Duur</span>
            <span className="font-semibold text-violet-700">
              {config.discussionTimerSeconds}s
            </span>
          </div>
        )}
        {config.discussionTimerEnabled && (
          <input
            type="range"
            min={30}
            max={300}
            step={15}
            value={config.discussionTimerSeconds}
            onChange={(e) => onChange({ discussionTimerSeconds: Number(e.target.value) })}
            className="mt-1 w-full accent-violet-600"
          />
        )}
      </div>

      <Button onClick={onNext}>Volgende</Button>
    </div>
  )
}

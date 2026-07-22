import { AnimatePresence, motion } from 'framer-motion'
import { CATEGORY_LABELS } from '../data/wordCategories'
import { MAX_PLAYERS, MIN_PLAYERS } from '../game/useGame'
import type { ConcreteCategory, GameConfig, Player } from '../types'
import { Button } from '../components/Button'

interface SetupScreenProps {
  config: GameConfig
  onChange: (config: Partial<GameConfig>) => void
  players: Player[]
  onPlayersChange: (players: Player[]) => void
  onAddPlayer: () => void
  onRemovePlayer: (id: string) => void
  onNext: () => void
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.3, ease: 'easeOut' as const },
  }),
}

export function SetupScreen({
  config,
  onChange,
  players,
  onPlayersChange,
  onAddPlayer,
  onRemovePlayer,
  onNext,
}: SetupScreenProps) {
  const maxImposters = Math.max(1, players.length - 1)

  function toggleCategory(key: ConcreteCategory) {
    const isSelected = config.categories.includes(key)
    onChange({
      categories: isSelected
        ? config.categories.filter((c) => c !== key)
        : [...config.categories, key],
    })
  }

  function updateName(id: string, name: string) {
    onPlayersChange(players.map((p) => (p.id === id ? { ...p, name } : p)))
  }

  function handleStart() {
    onPlayersChange(
      players.map((p, i) => ({ ...p, name: p.name.trim() === '' ? `Speler ${i + 1}` : p.name.trim() })),
    )
    onNext()
  }

  return (
    <div className="flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center"
      >
        <h1 className="text-4xl font-extrabold text-violet-700">Who's the Imposter</h1>
        <p className="mt-2 text-slate-500">Stel je spel in en geef de telefoon door</p>
      </motion.div>

      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="rounded-2xl bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">Spelers</span>
          <span className="text-2xl font-bold text-violet-700">{players.length}</span>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {players.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <input
                value={p.name}
                placeholder={`Speler ${i + 1}`}
                onChange={(e) => updateName(p.id, e.target.value)}
                className="flex-1 rounded-xl border-2 border-violet-100 bg-white px-3 py-2 text-base outline-none focus:border-violet-400"
              />
              {players.length > MIN_PLAYERS && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemovePlayer(p.id)}
                  aria-label={`Verwijder ${p.name || `Speler ${i + 1}`}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100"
                >
                  ✕
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>

        {players.length < MAX_PLAYERS && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onAddPlayer}
            className="mt-3 w-full rounded-xl border-2 border-dashed border-violet-200 py-2 text-sm font-semibold text-violet-600 hover:bg-violet-50"
          >
            + Speler toevoegen
          </motion.button>
        )}
      </motion.div>

      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="rounded-2xl bg-white p-5 shadow-sm"
      >
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
      </motion.div>

      <motion.div
        custom={2}
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="rounded-2xl bg-white p-5 shadow-sm"
      >
        <span className="font-semibold text-slate-700">Categorieën</span>
        <p className="mt-1 text-sm text-slate-500">
          Selecteer er een of meer. Niets geselecteerd = willekeurig uit alles.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => onChange({ categories: [] })}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              config.categories.length === 0
                ? 'bg-violet-600 text-white'
                : 'bg-violet-50 text-violet-700'
            }`}
          >
            🎲 Willekeurig (alles)
          </motion.button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.94 }}
              onClick={() => toggleCategory(key as ConcreteCategory)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                config.categories.includes(key as ConcreteCategory)
                  ? 'bg-violet-600 text-white'
                  : 'bg-violet-50 text-violet-700'
              }`}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        custom={3}
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="rounded-2xl bg-white p-5 shadow-sm"
      >
        <label className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">Discussie-timer</span>
          <input
            type="checkbox"
            checked={config.discussionTimerEnabled}
            onChange={(e) => onChange({ discussionTimerEnabled: e.target.checked })}
            className="h-6 w-6 accent-violet-600"
          />
        </label>
        <AnimatePresence initial={false}>
          {config.discussionTimerEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-slate-500">Duur</span>
                <span className="font-semibold text-violet-700">
                  {config.discussionTimerSeconds}s
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={300}
                step={15}
                value={config.discussionTimerSeconds}
                onChange={(e) => onChange({ discussionTimerSeconds: Number(e.target.value) })}
                className="mt-1 w-full accent-violet-600"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Button onClick={handleStart}>Start ronde</Button>
    </div>
  )
}

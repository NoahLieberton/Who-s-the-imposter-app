import { AnimatePresence, motion } from 'framer-motion'
import { CATEGORY_LABELS } from '../data/wordCategories'
import type { ConcreteCategory, GameConfig } from '../types'
import { Button } from '../components/Button'

interface SetupScreenProps {
  config: GameConfig
  onChange: (config: Partial<GameConfig>) => void
  onNext: () => void
}

const MIN_PLAYERS = 3
const MAX_PLAYERS = 10

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.3, ease: 'easeOut' as const },
  }),
}

export function SetupScreen({ config, onChange, onNext }: SetupScreenProps) {
  const maxImposters = Math.max(1, config.numPlayers - 1)

  function toggleCategory(key: ConcreteCategory) {
    const isSelected = config.categories.includes(key)
    onChange({
      categories: isSelected
        ? config.categories.filter((c) => c !== key)
        : [...config.categories, key],
    })
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

      <Button onClick={onNext}>Volgende</Button>
    </div>
  )
}

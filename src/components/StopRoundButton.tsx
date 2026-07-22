import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from './Button'

export function StopRoundButton({ onStop }: { onStop: () => void }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!confirming ? (
        <motion.button
          key="ask"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setConfirming(true)}
          className="text-sm text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
        >
          ⏹ Ronde stoppen
        </motion.button>
      ) : (
        <motion.div
          key="confirm"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex w-full max-w-xs flex-col gap-2 rounded-2xl border-2 border-rose-100 bg-rose-50 p-3"
        >
          <p className="text-center text-xs text-rose-700">
            Deze ronde stoppen en terug naar setup?
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setConfirming(false)}>
              Annuleren
            </Button>
            <Button variant="danger" className="flex-1" onClick={onStop}>
              Stoppen
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { motion } from 'framer-motion'
import { Button } from './Button'

interface PassDeviceCardProps {
  playerName: string
  prompt: string
  onReveal: () => void
}

export function PassDeviceCard({ playerName, prompt, onReveal }: PassDeviceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center gap-8 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-40 w-40 items-center justify-center rounded-full bg-violet-100 text-6xl"
      >
        ❓
      </motion.div>
      <div>
        <p className="text-sm uppercase tracking-wide text-violet-500">{prompt}</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">{playerName}</h2>
      </div>
      <Button onClick={onReveal}>Ik ben het, laat zien</Button>
    </motion.div>
  )
}

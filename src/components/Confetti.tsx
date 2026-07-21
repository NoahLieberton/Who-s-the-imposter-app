import { motion } from 'framer-motion'

const COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#3b82f6']
const PIECES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 0.4,
  duration: 1.6 + Math.random() * 0.8,
  rotate: Math.random() * 360,
  color: COLORS[i % COLORS.length],
}))

export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PIECES.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ top: '-5%', left: `${piece.left}%`, opacity: 1, rotate: 0 }}
          animate={{ top: '110%', rotate: piece.rotate }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: 8,
            height: 12,
            backgroundColor: piece.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  )
}

import { useState } from 'react'
import { isMuted, setMuted } from '../lib/sound'

export function SoundToggle() {
  const [muted, setMutedState] = useState(isMuted)

  return (
    <button
      onClick={() => {
        const next = !muted
        setMuted(next)
        setMutedState(next)
      }}
      aria-label={muted ? 'Geluid aanzetten' : 'Geluid uitzetten'}
      className="fixed right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-lg shadow-sm backdrop-blur"
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}

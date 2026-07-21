import { Button } from './Button'

interface PassDeviceCardProps {
  playerName: string
  prompt: string
  onReveal: () => void
}

export function PassDeviceCard({ playerName, prompt, onReveal }: PassDeviceCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center">
      <div className="flex h-40 w-40 items-center justify-center rounded-full bg-violet-100 text-6xl">
        ❓
      </div>
      <div>
        <p className="text-sm uppercase tracking-wide text-violet-500">{prompt}</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">{playerName}</h2>
      </div>
      <Button onClick={onReveal}>Ik ben het, laat zien</Button>
    </div>
  )
}

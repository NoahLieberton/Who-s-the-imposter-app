const STORAGE_KEY = 'imposter-sound-muted'

let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return null
    ctx = new AudioCtx()
  }
  return ctx
}

export function isMuted(): boolean {
  return localStorage.getItem(STORAGE_KEY) === '1'
}

export function setMuted(muted: boolean): void {
  localStorage.setItem(STORAGE_KEY, muted ? '1' : '0')
}

function tone(freq: number, startOffset: number, duration: number, gain: number, type: OscillatorType) {
  const audioCtx = getContext()
  if (!audioCtx || isMuted()) return
  const osc = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()
  osc.type = type
  osc.frequency.value = freq
  const start = audioCtx.currentTime + startOffset
  gainNode.gain.setValueAtTime(0, start)
  gainNode.gain.linearRampToValueAtTime(gain, start + 0.02)
  gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration)
  osc.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  osc.start(start)
  osc.stop(start + duration + 0.05)
}

export function playFlip() {
  tone(320, 0, 0.12, 0.05, 'sine')
}

export function playSelect() {
  tone(520, 0, 0.08, 0.05, 'triangle')
}

export function playTick() {
  tone(880, 0, 0.06, 0.04, 'square')
}

export function playWin() {
  tone(523, 0, 0.15, 0.06, 'sine')
  tone(659, 0.12, 0.15, 0.06, 'sine')
  tone(784, 0.24, 0.25, 0.06, 'sine')
}

export function playLose() {
  tone(220, 0, 0.2, 0.06, 'sawtooth')
  tone(180, 0.15, 0.35, 0.06, 'sawtooth')
}

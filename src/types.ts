export type ConcreteCategory =
  | 'eten-drinken'
  | 'dieren'
  | 'beroepen'
  | 'plaatsen'
  | 'sport'
  | 'films-series'
  | 'voorwerpen'

export interface Player {
  id: string
  name: string
}

export interface WordEntry {
  word: string
  /** Broad, plausible hints an imposter could get instead of the real word. */
  hints: string[]
}

export interface GameConfig {
  numImposters: number
  /** Categories eligible for the round. Empty means any category. */
  categories: ConcreteCategory[]
  discussionTimerEnabled: boolean
  discussionTimerSeconds: number
}

export interface Vote {
  voterId: string
  votedForId: string
}

export interface RoundData {
  secretWord: string
  categoryUsed: ConcreteCategory
  hintWord: string
  imposterIds: string[]
}

export type Screen = 'setup' | 'reveal' | 'discussion' | 'voting' | 'results'

export interface GameState {
  screen: Screen
  config: GameConfig
  players: Player[]
  nextPlayerId: number
  round: RoundData | null
  currentRevealIndex: number
  currentVoterIndex: number
  votes: Vote[]
  startingPlayerId: string | null
  /** Cumulative points per player id, across rounds with the same players. */
  score: Record<string, number>
  /** Secret words already used this game, to avoid repeats until a category is exhausted. */
  usedWords: string[]
}

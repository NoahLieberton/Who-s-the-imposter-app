export type ConcreteCategory =
  | 'eten-drinken'
  | 'dieren'
  | 'beroepen'
  | 'plaatsen'
  | 'sport'
  | 'films-series'
  | 'voorwerpen'
  | 'kleding'
  | 'vervoer'

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
  /** When false, skip the app's pass-and-play voting round in favor of a
   * single manual-entry screen for groups voting in real life (e.g. by
   * pointing). */
  votingEnabled: boolean
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

export type Screen = 'setup' | 'reveal' | 'discussion' | 'voting' | 'manual-result' | 'results'

export interface ManualResult {
  /** Per non-imposter player id, how many of their real-life guesses landed
   * on an actual imposter (0 up to the number of imposters in the round). */
  correctVoteCounts: Record<string, number>
  /** Imposter player ids the group actually caught in real life. */
  caughtImposterIds: string[]
}

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
  /** Set when the round was scored via manual entry instead of app voting. */
  manualResult: ManualResult | null
}

export type ConcreteCategory =
  | 'eten-drinken'
  | 'dieren'
  | 'beroepen'
  | 'plaatsen'
  | 'sport'
  | 'films-series'
  | 'voorwerpen'

export type Category = ConcreteCategory | 'random'

export interface Player {
  id: string
  name: string
}

export interface GameConfig {
  numPlayers: number
  numImposters: number
  category: Category
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
  imposterIds: string[]
}

export type Screen =
  | 'setup'
  | 'players'
  | 'reveal'
  | 'discussion'
  | 'voting'
  | 'results'

export interface GameState {
  screen: Screen
  config: GameConfig
  players: Player[]
  round: RoundData | null
  currentRevealIndex: number
  currentVoterIndex: number
  votes: Vote[]
}

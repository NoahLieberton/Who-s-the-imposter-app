import { useReducer } from 'react'
import type { GameConfig, GameState, Player, Vote } from '../types'
import { startRound } from './gameLogic'

const DEFAULT_CONFIG: GameConfig = {
  numPlayers: 4,
  numImposters: 1,
  category: 'random',
  discussionTimerEnabled: true,
  discussionTimerSeconds: 90,
}

function initialPlayers(numPlayers: number): Player[] {
  return Array.from({ length: numPlayers }, (_, i) => ({
    id: `player-${i}`,
    name: `Speler ${i + 1}`,
  }))
}

function initialState(): GameState {
  return {
    screen: 'setup',
    config: DEFAULT_CONFIG,
    players: initialPlayers(DEFAULT_CONFIG.numPlayers),
    round: null,
    currentRevealIndex: 0,
    currentVoterIndex: 0,
    votes: [],
  }
}

type Action =
  | { type: 'SET_CONFIG'; config: Partial<GameConfig> }
  | { type: 'GO_TO_PLAYERS' }
  | { type: 'SET_PLAYERS'; players: Player[] }
  | { type: 'START_ROUND' }
  | { type: 'ADVANCE_REVEAL' }
  | { type: 'START_DISCUSSION' }
  | { type: 'START_VOTING' }
  | { type: 'CAST_VOTE'; vote: Vote }
  | { type: 'RESTART_SAME_PLAYERS' }
  | { type: 'RESET_ALL' }

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_CONFIG': {
      const config = { ...state.config, ...action.config }
      const players =
        config.numPlayers !== state.config.numPlayers
          ? initialPlayers(config.numPlayers)
          : state.players
      return { ...state, config, players }
    }
    case 'GO_TO_PLAYERS':
      return { ...state, screen: 'players' }
    case 'SET_PLAYERS':
      return { ...state, players: action.players }
    case 'START_ROUND':
      return {
        ...state,
        screen: 'reveal',
        round: startRound(state.players, state.config),
        currentRevealIndex: 0,
        currentVoterIndex: 0,
        votes: [],
      }
    case 'ADVANCE_REVEAL': {
      const nextIndex = state.currentRevealIndex + 1
      if (nextIndex >= state.players.length) {
        return { ...state, screen: 'discussion', currentRevealIndex: nextIndex }
      }
      return { ...state, currentRevealIndex: nextIndex }
    }
    case 'START_DISCUSSION':
      return { ...state, screen: 'discussion' }
    case 'START_VOTING':
      return { ...state, screen: 'voting', currentVoterIndex: 0, votes: [] }
    case 'CAST_VOTE': {
      const votes = [...state.votes, action.vote]
      const nextVoterIndex = state.currentVoterIndex + 1
      if (nextVoterIndex >= state.players.length) {
        return { ...state, votes, screen: 'results', currentVoterIndex: nextVoterIndex }
      }
      return { ...state, votes, currentVoterIndex: nextVoterIndex }
    }
    case 'RESTART_SAME_PLAYERS':
      return {
        ...state,
        screen: 'reveal',
        round: startRound(state.players, state.config),
        currentRevealIndex: 0,
        currentVoterIndex: 0,
        votes: [],
      }
    case 'RESET_ALL':
      return initialState()
    default:
      return state
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  return { state, dispatch }
}

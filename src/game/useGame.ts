import { useReducer } from 'react'
import type { GameConfig, GameState, Player, Vote } from '../types'
import { applyRoundScore, pickStartingPlayer, startRound } from './gameLogic'

export const MIN_PLAYERS = 3
export const MAX_PLAYERS = 10
const DEFAULT_NUM_PLAYERS = 4

const DEFAULT_CONFIG: GameConfig = {
  numImposters: 1,
  categories: [],
  discussionTimerEnabled: true,
  discussionTimerSeconds: 90,
}

function initialPlayers(numPlayers: number): Player[] {
  return Array.from({ length: numPlayers }, (_, i) => ({
    id: `player-${i}`,
    name: '',
  }))
}

function initialState(): GameState {
  return {
    screen: 'setup',
    config: DEFAULT_CONFIG,
    players: initialPlayers(DEFAULT_NUM_PLAYERS),
    nextPlayerId: DEFAULT_NUM_PLAYERS,
    round: null,
    currentRevealIndex: 0,
    currentVoterIndex: 0,
    votes: [],
    startingPlayerId: null,
    score: {},
  }
}

type Action =
  | { type: 'SET_CONFIG'; config: Partial<GameConfig> }
  | { type: 'SET_PLAYERS'; players: Player[] }
  | { type: 'ADD_PLAYER' }
  | { type: 'REMOVE_PLAYER'; id: string }
  | { type: 'START_ROUND' }
  | { type: 'ADVANCE_REVEAL' }
  | { type: 'PREVIOUS_REVEAL' }
  | { type: 'START_DISCUSSION' }
  | { type: 'START_VOTING' }
  | { type: 'CAST_VOTE'; vote: Vote }
  | { type: 'PREVIOUS_VOTE' }
  | { type: 'RESTART_SAME_PLAYERS' }
  | { type: 'RESET_ALL' }

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, config: { ...state.config, ...action.config } }
    case 'SET_PLAYERS':
      return { ...state, players: action.players }
    case 'ADD_PLAYER': {
      if (state.players.length >= MAX_PLAYERS) return state
      return {
        ...state,
        players: [...state.players, { id: `player-${state.nextPlayerId}`, name: '' }],
        nextPlayerId: state.nextPlayerId + 1,
      }
    }
    case 'REMOVE_PLAYER': {
      if (state.players.length <= MIN_PLAYERS) return state
      const players = state.players.filter((p) => p.id !== action.id)
      const numImposters = Math.min(state.config.numImposters, players.length - 1)
      return { ...state, players, config: { ...state.config, numImposters } }
    }
    case 'START_ROUND':
      return {
        ...state,
        screen: 'reveal',
        round: startRound(state.players, state.config),
        currentRevealIndex: 0,
        currentVoterIndex: 0,
        votes: [],
        startingPlayerId: null,
      }
    case 'ADVANCE_REVEAL': {
      const nextIndex = state.currentRevealIndex + 1
      if (nextIndex >= state.players.length) {
        return {
          ...state,
          screen: 'discussion',
          currentRevealIndex: nextIndex,
          startingPlayerId: pickStartingPlayer(state.players),
        }
      }
      return { ...state, currentRevealIndex: nextIndex }
    }
    case 'PREVIOUS_REVEAL':
      return { ...state, currentRevealIndex: Math.max(0, state.currentRevealIndex - 1) }
    case 'START_DISCUSSION':
      return { ...state, screen: 'discussion' }
    case 'START_VOTING':
      return { ...state, screen: 'voting', currentVoterIndex: 0, votes: [] }
    case 'CAST_VOTE': {
      const votes = [...state.votes, action.vote]
      const nextVoterIndex = state.currentVoterIndex + 1
      if (nextVoterIndex >= state.players.length) {
        const score = applyRoundScore(state.score, state.players, state.round!, votes)
        return { ...state, votes, screen: 'results', currentVoterIndex: nextVoterIndex, score }
      }
      return { ...state, votes, currentVoterIndex: nextVoterIndex }
    }
    case 'PREVIOUS_VOTE': {
      if (state.currentVoterIndex === 0) return state
      return {
        ...state,
        votes: state.votes.slice(0, -1),
        currentVoterIndex: state.currentVoterIndex - 1,
      }
    }
    case 'RESTART_SAME_PLAYERS':
      return {
        ...state,
        screen: 'reveal',
        round: startRound(state.players, state.config),
        currentRevealIndex: 0,
        currentVoterIndex: 0,
        votes: [],
        startingPlayerId: null,
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

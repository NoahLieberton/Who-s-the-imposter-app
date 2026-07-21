import { WORD_CATEGORIES } from '../data/wordCategories'
import type { ConcreteCategory, GameConfig, Player, RoundData, Vote, WordPair } from '../types'

export const CREW_WIN_POINTS = 1
export const IMPOSTER_WIN_POINTS = 2

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function pickCategory(selectedCategories: ConcreteCategory[]): ConcreteCategory {
  const pool = selectedCategories.length > 0
    ? selectedCategories
    : (Object.keys(WORD_CATEGORIES) as ConcreteCategory[])
  return pool[Math.floor(Math.random() * pool.length)]
}

export function pickWordPair(category: ConcreteCategory): WordPair {
  const pairs = WORD_CATEGORIES[category]
  const pair = pairs[Math.floor(Math.random() * pairs.length)]
  return Math.random() < 0.5 ? pair : { word: pair.hint, hint: pair.word }
}

export function assignImposters(players: Player[], numImposters: number): string[] {
  const count = Math.min(Math.max(numImposters, 1), players.length - 1)
  return shuffle(players.map((p) => p.id)).slice(0, count)
}

export function pickStartingPlayer(players: Player[]): string {
  return players[Math.floor(Math.random() * players.length)].id
}

export function startRound(players: Player[], config: GameConfig): RoundData {
  const categoryUsed = pickCategory(config.categories)
  const { word, hint } = pickWordPair(categoryUsed)
  return {
    secretWord: word,
    categoryUsed,
    hintWord: hint,
    imposterIds: assignImposters(players, config.numImposters),
  }
}

export function tallyVotes(votes: Vote[]): Record<string, number> {
  const tally: Record<string, number> = {}
  for (const vote of votes) {
    tally[vote.votedForId] = (tally[vote.votedForId] ?? 0) + 1
  }
  return tally
}

export function getMostVotedPlayerIds(tally: Record<string, number>): string[] {
  const entries = Object.entries(tally)
  if (entries.length === 0) return []
  const max = Math.max(...entries.map(([, count]) => count))
  return entries.filter(([, count]) => count === max).map(([id]) => id)
}

export function computeResult(
  round: RoundData,
  mostVotedIds: string[],
): { correct: boolean; tie: boolean } {
  const tie = mostVotedIds.length !== 1
  const correct = !tie && round.imposterIds.includes(mostVotedIds[0])
  return { correct, tie }
}

/**
 * Win rule: crew wins the round (and scores) only if the single most-voted
 * player is an imposter. A tie or a wrong guess both count as the
 * imposter(s) escaping, so they score instead.
 */
export function roundPointsFor(isImposter: boolean, correct: boolean): number {
  if (correct) return isImposter ? 0 : CREW_WIN_POINTS
  return isImposter ? IMPOSTER_WIN_POINTS : 0
}

export function applyRoundScore(
  score: Record<string, number>,
  players: Player[],
  round: RoundData,
  votes: Vote[],
): Record<string, number> {
  const { correct } = computeResult(round, getMostVotedPlayerIds(tallyVotes(votes)))
  const next = { ...score }
  for (const p of players) {
    const points = roundPointsFor(round.imposterIds.includes(p.id), correct)
    next[p.id] = (next[p.id] ?? 0) + points
  }
  return next
}

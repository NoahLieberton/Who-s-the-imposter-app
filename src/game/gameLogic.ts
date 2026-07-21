import { WORD_CATEGORIES } from '../data/wordCategories'
import type { ConcreteCategory, GameConfig, Player, RoundData, Vote } from '../types'

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

export function pickSecretWord(category: ConcreteCategory): string {
  const words = WORD_CATEGORIES[category]
  return words[Math.floor(Math.random() * words.length)]
}

export function assignImposters(players: Player[], numImposters: number): string[] {
  const count = Math.min(Math.max(numImposters, 1), players.length - 1)
  return shuffle(players.map((p) => p.id)).slice(0, count)
}

export function startRound(players: Player[], config: GameConfig): RoundData {
  const categoryUsed = pickCategory(config.categories)
  return {
    secretWord: pickSecretWord(categoryUsed),
    categoryUsed,
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

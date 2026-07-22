import { WORD_CATEGORIES } from '../data/wordCategories'
import type { ConcreteCategory, GameConfig, Player, RoundData, Vote, WordEntry } from '../types'

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

/**
 * Picks a word that hasn't been used yet this game where possible. Once a
 * category's whole word list has been seen, it naturally starts allowing
 * repeats again instead of the game grinding to a halt.
 */
export function pickWordEntry(category: ConcreteCategory, usedWords: string[]): WordEntry {
  const all = WORD_CATEGORIES[category]
  const unused = all.filter((entry) => !usedWords.includes(entry.word))
  const pool = unused.length > 0 ? unused : all
  return pool[Math.floor(Math.random() * pool.length)]
}

export function pickHint(entry: WordEntry): string {
  return entry.hints[Math.floor(Math.random() * entry.hints.length)]
}

export function assignImposters(players: Player[], numImposters: number): string[] {
  const count = Math.min(Math.max(numImposters, 1), players.length - 1)
  return shuffle(players.map((p) => p.id)).slice(0, count)
}

export function pickStartingPlayer(players: Player[]): string {
  return players[Math.floor(Math.random() * players.length)].id
}

export function startRound(players: Player[], config: GameConfig, usedWords: string[]): RoundData {
  const categoryUsed = pickCategory(config.categories)
  const entry = pickWordEntry(categoryUsed, usedWords)
  return {
    secretWord: entry.word,
    categoryUsed,
    hintWord: pickHint(entry),
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
 * Win rule (per player, not per round): a crew member only scores if their
 * own vote landed on an actual imposter — being in a group that happened to
 * vote out the imposter isn't enough if you personally voted for someone
 * else. An imposter scores if they personally weren't the one voted out
 * (a tie means nobody was voted out, so every imposter escapes).
 */
export function roundPointsFor(
  player: Player,
  round: RoundData,
  mostVotedIds: string[],
  tie: boolean,
  votes: Vote[],
): number {
  const isImposter = round.imposterIds.includes(player.id)
  if (isImposter) {
    const wasCaught = !tie && mostVotedIds.includes(player.id)
    return wasCaught ? 0 : IMPOSTER_WIN_POINTS
  }
  const myVote = votes.find((v) => v.voterId === player.id)
  const votedCorrectly = !!myVote && round.imposterIds.includes(myVote.votedForId)
  return votedCorrectly ? CREW_WIN_POINTS : 0
}

export function applyRoundScore(
  score: Record<string, number>,
  players: Player[],
  round: RoundData,
  votes: Vote[],
): Record<string, number> {
  const tally = tallyVotes(votes)
  const mostVotedIds = getMostVotedPlayerIds(tally)
  const tie = mostVotedIds.length !== 1
  const next = { ...score }
  for (const p of players) {
    next[p.id] = (next[p.id] ?? 0) + roundPointsFor(p, round, mostVotedIds, tie, votes)
  }
  return next
}

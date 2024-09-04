import { Ball, GameState } from '../models/game'
import { calculateShot } from '../utils/physics'

// Generate AI move based on game difficulty
export const makeAiMove = (gameState: GameState, difficulty: 'easy' | 'medium' | 'hard'): { cueAngle: number, power: number } => {
  let cueAngle = Math.random() * 360  // Random cue angle
  let power = Math.random() * 100     // Random power

  // Adjust the AI move based on difficulty
  switch (difficulty) {
    case 'easy':
      cueAngle += Math.random() * 20 - 10  // Add randomness to make it easier
      power *= 0.7  // Less power
      break
    case 'medium':
      cueAngle += Math.random() * 10 - 5  // Moderate randomness
      power *= 0.85  // Medium power
      break
    case 'hard':
      cueAngle += Math.random() * 5 - 2.5  // Less randomness
      power *= 1.0  // Full power
      break
  }

  return { cueAngle, power }
}

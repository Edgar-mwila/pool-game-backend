// src/utils/gameLogic.ts
import { Game } from '../models/game';
import { GameState, Ball } from '../models/game'

// Simulate the movement of balls based on the cue hit
export const calculateBallMovement = (gameState: GameState): Ball[] => {
  // Simple physics logic for ball movement (could be improved for realism)
  return gameState.balls.map(ball => {
    if (!ball.pocketed) {
      // Simulate movement of the ball (this can be expanded with more physics)
      ball.position.x += Math.random() * 0.1
      ball.position.y += Math.random() * 0.1
    }
    return ball
  })
}

// Check the current status of the game (e.g., balls pocketed, game over)
export const checkGameStatus = (gameState: GameState): GameState => {
  // Check for pocketed balls
  gameState.balls.forEach(ball => {
    if (ball.position.x > 1 || ball.position.y > 1) {
      ball.pocketed = true
    }
  })

  // Update scores and check for winner
  if (gameState.balls.filter(ball => ball.pocketed).length === gameState.balls.length - 1) {
    gameState.winner = gameState.currentTurn // Current player wins
    gameState.gameStatus = 'finished'
  }

  return gameState
}

// Switch turn between player and AI
export const switchTurn = (gameState: GameState): string => {
  return gameState.currentTurn === 'AI' ? 'player1' : 'AI'
}

// Function to determine if a ball has been pocketed
export const isBallPocketed = (ball: any, pocket: any) => {
  // Example logic to determine if a ball has been pocketed
  return Math.sqrt(
    Math.pow(ball.position.x - pocket.x, 2) +
    Math.pow(ball.position.y - pocket.y, 2) +
    Math.pow(ball.position.z - pocket.z, 2)
  ) < ball.radius;
};

// Function to calculate the winner based on scores
export const calculateWinner = (scores: { [key: string]: number }) => {
  const entries = Object.entries(scores);
  const winner = entries.reduce((max, [playerId, score]) => score > max.score ? { playerId, score } : max, { playerId: '', score: -Infinity });
  return winner.playerId;
};

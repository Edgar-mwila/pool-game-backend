// src/services/gameService.ts
import { firestore } from '../config/firebase';
import { Game, GameState } from '../models/game';
import { Timestamp } from 'firebase-admin/firestore';
import { makeAiMove } from './aiService'
import { calculateBallMovement, checkGameStatus, switchTurn } from '../utils/gameLogic'

// Process a player's move
export const processPlayerMove = (gameState: GameState, playerMove: { cueAngle: number, power: number }): GameState => {
  // Update cue position and power based on the player's move
  gameState.cueAngle = playerMove.cueAngle
  gameState.power = playerMove.power

  // Simulate ball movements based on the player's shot
  gameState.balls = calculateBallMovement(gameState)

  // Check if any balls were pocketed and update scores
  gameState = checkGameStatus(gameState)

  // Switch turn to AI or another player
  gameState.currentTurn = switchTurn(gameState)

  return gameState // Return the updated game state
}

// Process the AI's move
export const processAiMove = (gameState: GameState, aiDifficulty: 'easy' | 'medium' | 'hard'): GameState => {
  // Generate an AI move based on the current game state and difficulty
  const aiMove = makeAiMove(gameState, aiDifficulty)

  // Apply the AI's move (similar to how the player move works)
  gameState.cueAngle = aiMove.cueAngle
  gameState.power = aiMove.power

  // Simulate ball movements based on AI's shot
  gameState.balls = calculateBallMovement(gameState)

  // Check if any balls were pocketed and update scores
  gameState = checkGameStatus(gameState)

  // Switch turn back to the player
  gameState.currentTurn = switchTurn(gameState)

  return gameState // Return the updated game state
}

export const createNewGame = async (playerId: string, username: string) => {
  const newGame: Game = {
    gameId: '', // Will be set upon creation
    players: [{ id: playerId, username }],
    currentTurn: playerId,
    balls: [], // Initialize with default ball positions if needed
    cuePosition: { x: 0, y: 0, z: 0 },
    cueAngle: 0,
    power: 0,
    scores: { [playerId]: 0 },
    gameStatus: 'waiting',
    winner: null,
    aiDifficulty: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const gameRef = await firestore.collection('games').add(newGame);
  return { ...newGame, gameId: gameRef.id };
};

export const addPlayerToGame = async (gameId: string, playerId: string, username: string) => {
  const gameRef = firestore.collection('games').doc(gameId);
  const gameDoc = await gameRef.get();

  if (!gameDoc.exists) throw new Error('Game not found');

  const game = gameDoc.data() as Game;

  if (game.players.length >= 2) throw new Error('Game is already full');

  game.players.push({ id: playerId, username });
  game.updatedAt = Timestamp.now();
  
  const updatedGameData = {
    balls: game.balls,
    cuePosition: game.cuePosition,
    cueAngle: game.cueAngle,
    power: game.power,
    scores: game.scores,
    gameStatus: game.gameStatus,
    winner: game.winner,
    players: game.players,
    updatedAt: Timestamp.now(),
  };

  await gameRef.update(updatedGameData);
  return game;
};

export const updateGame = async (gameId: string, updates: Partial<Game>) => {
  const gameRef = firestore.collection('games').doc(gameId);
  const gameDoc = await gameRef.get();

  if (!gameDoc.exists) throw new Error('Game not found');

  const game = gameDoc.data() as Game;

  const updatedGameData = {
    balls: updates.balls || game.balls,
    cuePosition: updates.cuePosition || game.cuePosition,
    cueAngle: updates.cueAngle !== undefined ? updates.cueAngle : game.cueAngle,  // Allow 0 for cueAngle
    power: updates.power !== undefined ? updates.power : game.power,              // Allow 0 for power
    scores: updates.scores || game.scores,
    gameStatus: updates.gameStatus || game.gameStatus,
    winner: updates.winner || game.winner,
    updatedAt: Timestamp.now(),
  };

  await gameRef.update(updatedGameData);
  return { ...game, ...updatedGameData }; // Return the merged game data
};

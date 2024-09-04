import { firestore } from '../config/firebase'

export interface Ball {
  id: number
  position: { x: number; y: number; z: number }
  pocketed: boolean
}

export interface Game {
  gameId: string
  players: { id: string; username: string }[]
  currentTurn: string | null
  balls: {
    id: number
    position: { x: number; y: number; z: number }
    velocity: { x: number; y: number; z: number }
    pocketed: boolean
  }[]
  cuePosition: { x: number; y: number; z: number }
  cueAngle: number
  power: number
  scores: { [playerId: string]: number }
  gameStatus: 'waiting' | 'active' | 'completed'
  winner: string | null
  aiDifficulty: 'easy' | 'medium' | 'hard' | null
  createdAt: FirebaseFirestore.Timestamp
  updatedAt: FirebaseFirestore.Timestamp
}

// GameState Interface
export interface GameState {
  balls: Ball[]
  cuePosition: {
    x: number
    y: number
    z: number
  }
  cueAngle: number
  power: number
  scores: {
    player1: number
    player2: number
  }
  gameStatus: 'waiting' | 'in-progress' | 'finished'
  winner: string | null
  currentTurn: string // playerId of the player who has the current turn
}

export const createGame = async (game: Game) => {
  const gameRef = firestore.collection('games').doc(game.gameId)
  await gameRef.set(game)
}

export const getGameById = async (id: string): Promise<Game | null> => {
  const gameDoc = await firestore.collection('games').doc(id).get()
  if (gameDoc.exists) {
    return gameDoc.data() as Game
  }
  return null
}

export const updateGame = async (id: string, updates: Partial<Game>) => {
  const gameRef = firestore.collection('games').doc(id)
  await gameRef.update(updates)
}

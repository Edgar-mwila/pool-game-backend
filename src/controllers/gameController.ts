// src/controllers/gameController.ts
import { Request, Response } from 'express';
import { firestore } from '../config/firebase';  // Firestore database instance
import { Game, GameState } from '../models/game';
import { Timestamp } from 'firebase-admin/firestore'
import { processAiMove, processPlayerMove } from '../services/gameService'

export const playTurn = async (req: Request, res: Response) => {
  const { gameId } = req.params
  const { playerMove, aiDifficulty } = req.body

  try {
    const gameDoc = await firestore.collection('games').doc(gameId).get()

    if (!gameDoc.exists) {
      return res.status(404).json({ error: 'Game not found' })
    }

    let game = gameDoc.data() as GameState

    // If it's AI's turn
    if (game.currentTurn === 'AI') {
      game = processAiMove(game, aiDifficulty)
    } else {
      // Process player's move
      game = processPlayerMove(game, playerMove)
    }

    const updatedGameData = {
      balls: game.balls,
      cuePosition: game.cuePosition,
      cueAngle: game.cueAngle,
      power: game.power,
      scores: game.scores,
      gameStatus: game.gameStatus,
      winner: game.winner,
      updatedAt: Timestamp.now(),
    };

    await firestore.collection('games').doc(gameId).update(updatedGameData)

    res.status(200).json({ message: 'Turn processed', game })
  } catch (error) {
    console.error('Error processing turn:', error)
    res.status(500).json({ error: 'Failed to process turn' })
  }
}

// Create a new game
export const createGame = async (req: Request, res: Response) => {
  const { players, aiDifficulty } = req.body;

  try {
    const gameId = firestore.collection('games').doc().id;

    const game: Game = {
      gameId,
      players,
      currentTurn: players[0].id,
      balls: [],
      cuePosition: { x: 0, y: 0, z: 0 },
      cueAngle: 0,
      power: 0,
      scores: players.reduce((acc: Record<string, number>, player: any) => {
        acc[player.id] = 0;
        return acc;
      }, {}),
      gameStatus: 'waiting',
      winner: null,
      aiDifficulty,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await firestore.collection('games').doc(gameId).set(game);

    res.status(201).json({ message: 'Game created successfully', game });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Game creation failed' });
  }
};

// Join an existing game
export const joinGame = async (req: Request, res: Response) => {
    const { gameId } = req.params;
    const { playerId, username } = req.body;
  
    try {
      const gameDoc = await firestore.collection('games').doc(gameId).get();
  
      if (!gameDoc.exists) {
        return res.status(404).json({ error: 'Game not found' });
      }
  
      const game = gameDoc.data() as Game;
  
      if (game.players.length >= 2) {
        return res.status(400).json({ error: 'Game is already full' });
      }
  
      game.players.push({ id: playerId, username });
      game.updatedAt = Timestamp.now();
  
      await firestore.collection('games').doc(gameId).update({
        players: game.players,
        updatedAt: game.updatedAt,
      });
  
      res.status(200).json({ message: 'Joined game successfully', game });
    } catch (error) {
      console.error('Error joining game:', error);
      res.status(500).json({ error: 'Failed to join game' });
    }
  };

// Update game state
export const updateGameState = async (req: Request, res: Response) => {
    const { gameId } = req.params;
    const { balls, cuePosition, cueAngle, power, scores, gameStatus, winner } = req.body;
  
    try {
      const gameDoc = await firestore.collection('games').doc(gameId).get();
  
      if (!gameDoc.exists) {
        return res.status(404).json({ error: 'Game not found' });
      }
  
      const game = gameDoc.data() as Game;
  
      // Update the game state
      const updatedGameData = {
        balls: balls || game.balls,
        cuePosition: cuePosition || game.cuePosition,
        cueAngle: cueAngle !== undefined ? cueAngle : game.cueAngle,
        power: power !== undefined ? power : game.power,
        scores: scores || game.scores,
        gameStatus: gameStatus || game.gameStatus,
        winner: winner || game.winner,
        updatedAt: Timestamp.now(),
      };
  
      await firestore.collection('games').doc(gameId).update(updatedGameData);
  
      res.status(200).json({ message: 'Game state updated successfully', game: updatedGameData });
    } catch (error) {
      console.error('Error updating game state:', error);
      res.status(500).json({ error: 'Failed to update game state' });
    }
  };

  // Get game details by ID
export const getGameById = async (req: Request, res: Response) => {
  try {
    const gameId = req.params.id
    const gameDoc = await firestore.collection('games').doc(gameId).get()

    if (!gameDoc.exists) {
      return res.status(404).json({ message: 'Game not found' })
    }

    const gameData = gameDoc.data() as Game
    res.status(200).json({ ...gameData })
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve game', error })
  }
}
  
// Function to get all available games that can be joined
export const getAvailableGames = async (req: Request, res: Response) => {
  try {
    // Query Firestore for games that have less than 2 players
    const gamesQuerySnapshot = await firestore.collection('games')
      .where('players', '<', 2)
      .get();

    // Check if there are any available games
    if (gamesQuerySnapshot.empty) {
      return res.status(200).json({ message: 'No available games to join', games: [] });
    }

    // Collect the available games
    const availableGames: Game[] = gamesQuerySnapshot.docs.map((doc: any) => {
      const gameData = doc.data() as Game;
      return {
        ...gameData,
        gameId: doc.id, // Optionally include the game ID
      };
    });

    // Respond with the list of available games
    return res.status(200).json({ games: availableGames });

  } catch (error) {
    console.error('Error fetching available games:', error);
    return res.status(500).json({ error: 'Failed to fetch available games' });
  }
};
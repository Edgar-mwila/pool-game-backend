// src/routes/gameRoutes.ts
import { Router } from 'express';
import { createGame, joinGame, updateGameState, getGameById, getAvailableGames } from '../controllers/gameController';

const router = Router();

// Route to get all available games
router.get('/', getAvailableGames);

// Route to create a new game
router.post('/create', createGame);

// Route to join an existing game
router.post('/:gameId/join', joinGame);

// Route to update the game state
router.put('/:gameId/update', updateGameState);

// Route to get a game by ID
router.get('/:gameId', getGameById);

export default router;

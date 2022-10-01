import express from "express";

import { listGame, insertGame } from '../controllers/games.controller.js';

const router = express.Router()

router.get('/games', listGame)
router.post('/games', insertGame)

export default router
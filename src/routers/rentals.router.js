import express from "express";

import { listRental, insertRental, endRental, deleteRental } from '../controllers/rentals.controller.js';

const router = express.Router()

router.get('/rentals', listRental)
router.post('/rentals', insertRental)
router.post('/rentals/:id/return', endRental)
router.delete('/rentals/:id', deleteRental)

export default router
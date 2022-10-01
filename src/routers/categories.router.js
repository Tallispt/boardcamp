import express from "express";

import { listCategory, insertCategory } from '../controllers/categories.controller.js';

const router = express.Router()

router.get('/categories', listCategory)
router.post('/categories', insertCategory)

export default router

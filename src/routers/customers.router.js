import express from "express";

import { listCustomer, listCustomerById, insertCustomer, updateCustomer } from '../controllers/customers.controller.js';

const router = express.Router()

router.get('/customers', listCustomer)
router.get('/customers/:id', listCustomerById)
router.post('/customers', insertCustomer)
router.put('/customers/:id', updateCustomer)

export default router
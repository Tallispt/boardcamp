import express from 'express';

import CategoriesRouter from './routers/categories.router.js'
import GamesRouter from './routers/games.router.js'
import CustomersRouter from './routers/customers.router.js'
import RentalsRouter from './routers/rentals.router.js'

const server = express()
server.use(express.json())


server.use(CategoriesRouter)
server.use(GamesRouter)
server.use(CustomersRouter)
server.use(RentalsRouter)


server.listen(4000, console.log("Connection on port 4000"))
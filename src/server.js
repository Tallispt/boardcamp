import express from 'express';
import cors from 'cors';

import CategoriesRouter from './routers/categories.router.js'
import GamesRouter from './routers/games.router.js'
import CustomersRouter from './routers/customers.router.js'
import RentalsRouter from './routers/rentals.router.js'

const server = express()
server.use(express.json())
server.use(cors())


server.use(CategoriesRouter)
server.use(GamesRouter)
server.use(CustomersRouter)
server.use(RentalsRouter)


server.listen(4000, console.log("Connection on port 4000"))

//Dúvida sobre:
// - no controller de RentalsRouter, como otimizar queries de listagem (get). Uso JOIN e depois crio um objeto com todas as informaçoes. Aparentemente muito poluido e confuso
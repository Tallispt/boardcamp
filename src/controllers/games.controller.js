import connection from '../database/database.js';
import joi from 'joi';

const gameSchema = joi.object({
    name: joi.string().min(1).required(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().greater(0).required(),
    categoryId: joi.number().required(),
    pricePerDay: joi.number().greater(0).required()
})

const listGame = async (req, res) => {
    const { name } = req.query

    try {
        if (name) {
            const game = await connection.query('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON categories.id=games."categoryId" WHERE LOWER(games.name) LIKE LOWER($1);', [name + '%'])
            return res.send(game.rows).status(200)
        }

        const games = await connection.query('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON categories.id=games."categoryId";')
        res.send(games.rows).status(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const insertGame = async (req, res) => {
    const gameData = req.body

    const validation = gameSchema.validate(gameData)
    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message)
    }

    try {
        const categoryExists = await connection.query('SELECT * FROM categories WHERE id=$1;', [gameData.categoryId])
        if (!categoryExists.rowCount) return res.sendStatus(400)

        const gameExists = await connection.query('SELECT * FROM games WHERE name=$1;', [gameData.name])
        if (gameExists.rowCount) return res.sendStatus(409)

        await connection.query('INSERT INTO games(name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);',
            [gameData.name,
            gameData.image,
            gameData.stockTotal,
            gameData.categoryId,
            gameData.pricePerDay])
        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { listGame, insertGame }
import connection from '../database/database.js';
import dayjs from 'dayjs';
import joi from 'joi';

const rentalSchema = joi.object({
    customerId: joi.number().greater(0).required(),
    gameId: joi.number().greater(0).required(),
    daysRented: joi.number().greater(0).required()
})

function returnRentals(obj) {
    return obj.rows.map(rental => {
        return {
            id: rental.rentalId,
            curtomerId: rental.categoryId,
            gameId: rental.gameId,
            rentDate: dayjs(rental.rentDate).format('YYYY-MM-DD'),
            daysRented: rental.daysRented,
            returnDate: rental.returnDate ? dayjs(rental.returnDate).format('YYYY-MM-DD') : rental.returnDate,
            originalPrice: rental.originalPrice,
            delayFee: rental.delayFee,
            customers: {
                id: rental.customerId,
                name: rental.customerName,
            },
            game: {
                id: rental.gameId,
                name: rental.gameName,
                categoryId: rental.categoryId,
                categoryName: rental.categoryName
            }
        }
    })
}

const listRental = async (req, res) => {
    const { customerId, gameId } = req.query

    const query = 'SELECT rentals.id AS "rentalId", customers.id AS "customerId", games.id AS "gameId", customers.name AS "customerName", categories.name AS "categoryName", games.name AS "gameName", rentals.*, customers. *, games.*, categories.* FROM rentals JOIN customers ON rentals."customerId"=customers.id JOIN games ON rentals."gameId"=games.id JOIN categories ON games."categoryId"=categories.id'

    try {
        if (customerId) {
            const rentals = await connection.query(query + ' WHERE customers.id=$1;', [customerId])
            return res.status(200).send(returnRentals(rentals))
        }
        if (gameId) {
            const rentals = await connection.query(query + ' WHERE games.id=$1;', [gameId])
            return res.status(200).send(returnRentals(rentals))
        }
        const rentals = await connection.query(query + ';')
        res.status(200).send(returnRentals(rentals))

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const insertRental = async (req, res) => {
    const rentalData = req.body

    const validation = rentalSchema.validate(rentalData)
    if (validation.error) return res.status(400).send(validation.error.details[0].message)

    try {
        const customerExists = await connection.query('SELECT * FROM customers WHERE id=$1;', [rentalData.customerId])
        if (!customerExists.rowCount) return res.sendStatus(400)

        const gameExists = await connection.query('SELECT * FROM games WHERE id=$1;', [rentalData.gameId])
        if (!gameExists.rowCount) return res.sendStatus(400)

        const numRentals = (await connection.query('SELECT * FROM rentals WHERE "gameId"=$1;', [rentalData.gameId])).rowCount
        if (numRentals >= gameExists.rows[0].stockTotal) return res.sendStatus(400)

        await connection.query('INSERT INTO rentals("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES($1, $2, $3, $4, null, $5, null);', [
            rentalData.customerId,
            rentalData.gameId,
            dayjs().format('YYYY-MM-DD'),
            rentalData.daysRented,
            rentalData.daysRented * gameExists.rows[0].pricePerDay
        ])
        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const endRental = async (req, res) => {
    const { id } = req.params

    try {
        const rentalExists = await connection.query('SELECT * FROM rentals WHERE id=$1;', [id])
        if (!rentalExists.rowCount) return res.sendStatus(404)

        if (rentalExists.rows[0].returnDate) return res.sendStatus(400)

        const today = dayjs().format('YYYY-MM-DD')
        const rentDate = rentalExists.rows[0].rentDate
        const daysRented = rentalExists.rows[0].daysRented
        const daysUsed = dayjs(today).diff(rentDate, 'days')
        const fee = 1500 * (daysUsed - daysRented)

        await connection.query('UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3', [
            today,
            daysUsed > daysRented ? fee : 0,
            id
        ])
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const deleteRental = async (req, res) => {
    const { id } = req.params

    try {
        const rentalExists = await connection.query('SELECT * FROM rentals WHERE id=$1;', [id])
        if (!rentalExists.rowCount) return res.sendStatus(404)

        await connection.query('DELETE FROM rentals WHERE id=$1;', [id])
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { listRental, insertRental, endRental, deleteRental }
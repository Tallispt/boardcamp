import connection from '../database/database.js';
import joi from 'joi';

const nameSchema = joi.object({
    name: joi.string().min(1).required()
})

const listCategory = async (req, res) => {
    try {
        const categories = await connection.query('SELECT * FROM categories;')
        res.status(200).send(categories.rows)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const insertCategory = async (req, res) => {
    const { name } = req.body

    const validation = nameSchema.validate({ name })
    if (validation.error) return res.status(400).send(validation.error.details[0].message)

    try {

        const nameExist = await connection.query('SELECT * FROM categories WHERE name=$1;', [name])
        if (nameExist.rowCount) return res.sendStatus(409)

        await connection.query('INSERT INTO categories(name) VALUES ($1);',
            [name])
        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { listCategory, insertCategory }
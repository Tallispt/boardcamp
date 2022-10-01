import connection from '../database/database.js'

const listCategory = async (req, res) => {
    try {
        const categories = await connection.query('SELECT * FROM categories')
        res.send(categories.rows).status(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const insertCategory = async (req, res) => {
    try {

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
    res.sendStatus(200)
}

export { listCategory, insertCategory }
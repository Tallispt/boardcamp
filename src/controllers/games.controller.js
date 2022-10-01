import connection from '../database/database.js'

const listGame = async (req, res) => {
    try {

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
    res.sendStatus(200)
}

const insertGame = async (req, res) => {
    try {

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
    res.sendStatus(200)
}

export { listGame, insertGame }
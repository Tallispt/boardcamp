import connection from '../database/database.js';
import dayjs from 'dayjs';
import baseJoi from 'joi';
import dateJoi from '@joi/date';

const joi = baseJoi.extend(dateJoi)

const customersSchema = joi.object({
    name: joi.string().min(1).required(),
    phone: joi.string().pattern(/^[0-9]+$/).min(10).max(11).required(),
    cpf: joi.string().pattern(/^[0-9]+$/).length(11).required(),
    birthday: joi.date().format('YYYY-MM-DD').required()
})

const listCustomer = async (req, res) => {
    const { cpf } = req.query

    try {
        if (cpf) {
            const customers = await connection.query('SELECT * FROM customers WHERE cpf LIKE $1;', [cpf + '%'])
            return res.status(200).send(customers.rows)
        }
        const customers = await connection.query('SELECT * FROM customers')
        res.status(200)
            .send(
                customers.rows.map(customer => {
                    return {
                        ...customer,
                        birthday: dayjs(customer.birthday).format('YYYY-MM-DD')
                    }
                }))
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const listCustomerById = async (req, res) => {
    const { id } = req.params

    try {
        const customers = await connection.query('SELECT * FROM customers WHERE id=$1', [id])
        if (!customers.rowCount) return res.sendStatus(404)
        return res.status(200).send(customers.rows[0])

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const insertCustomer = async (req, res) => {
    const customerData = req.body

    const validation = customersSchema.validate(customerData)
    if (validation.error) return res.status(400).send(validation.error.details[0].message)

    try {
        const cpfExistis = await connection.query('SELECT * FROM customers WHERE cpf=$1', [customerData.cpf])
        if (cpfExistis.rowCount) return res.sendStatus(409)

        //CONSERTAR BIRTHDAY QUE TA INDO FORA DO FORMATO YYYY-MM-DD
        await connection.query('INSERT INTO customers(name, phone, cpf, birthday) VALUES($1, $2, $3, $4);',
            [customerData.name,
            customerData.phone,
            customerData.cpf,
            dayjs(customerData.birthday).format('YYYY-MM-DD')])
        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const updateCustomer = async (req, res) => {
    const customerData = req.body
    const { id } = req.params

    const validation = customersSchema.validate(customerData)
    if (validation.error) return res.status(400).send(validation.error.details[0].message)

    try {
        const idExistis = await connection.query('SELECT * FROM customers WHERE id=$1', [id])
        if (!idExistis.rowCount) return res.sendStatus(404)

        if (customerData.cpf != idExistis.rows[0].cpf) return res.sendStatus(409)

        await connection.query('UPDATE customers SET name=$1, phone=$2, birthday=$3 WHERE cpf=$4;',
            [customerData.name,
            customerData.phone,
            customerData.birthday,
            customerData.cpf])
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { listCustomer, listCustomerById, insertCustomer, updateCustomer }
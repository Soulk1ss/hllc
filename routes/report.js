const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/report')
const logger = require('../helpers/logger');
const myLogger = new logger()
router.post('/', [
    check('u_id').not().isEmpty(),
    check('u_phone').not().isEmpty(),
    check('u_email').not().isEmpty(),
    check('u_problem').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        await myLogger.writeInfo("report", req, Date())
        res.send({ message: await service.onInsert(req.body) })
    } catch (err) {
        await myLogger.writeError("report", req, Date(), err)
        res.error(err)
    }
})
router.get('/', [
    //check('page').not().isEmpty().isInt().toInt()
], async (req, res) => {
    try {
        const items = await service.find(req.query)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
router.delete('/', async (req, res) => {
    console.log(req.query)
    try {
        const item = await service.findOne(req.query)
        if (!item) {
            throw new Error('Not found item.')
        } else {
            const deleteItem = await service.onDelete(item)
            console.log("complete")
            res.json(deleteItem)
        }
    } catch (err) {
        res.error(err)
    }
})


module.exports = router
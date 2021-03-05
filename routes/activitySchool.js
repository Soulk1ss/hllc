const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/activitySchool')
const logger = require('../helpers/logger');
const myLogger = new logger()

router.post('/', [
    check('u_id').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        res.json({ message: await service.onInsert(req.body) })
    } catch (err) {
        //await myLogger.writeError("addSchool", req, Date(), err)
        res.error(err)
    }
})

router.get('/:id', [

], async (req, res) => {
    try {
        //console.log(req.params.id)
        const items = await service.findOne(req.params.id)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
module.exports = router
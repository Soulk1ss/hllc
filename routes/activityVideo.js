const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/activityVideo')
const logger = require('../helpers/logger');
const myLogger = new logger()
// เพิ่มข้อมูลการดูวิดีโอ
router.post('/', [
    check('u_id').not().isEmpty(),
    check('u_username').not().isEmpty(),
    check('av_name').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        await myLogger.writeInfo("addVideo", req, Date())
        res.json({ message: await service.onInsert(req.body) })
    } catch (err) {
        await myLogger.writeError("addVideo", req, Date(), err)
        res.error(err)
    }
})
// แสดงข้อมูลตามรหัสนักศึกษา
router.get('/:id', [], async (req, res) => {
    try {
        const items = await service.findOne({ id: req.params.id, av_name: req.query.av_name })
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})

// update ข้อมูลการดูวิดีโอ
router.put('/:id', [
    check('u_username').not().isEmpty(),
    check('av_name').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const item = await service.findOne({ id: req.params.id })
        if (!item) {
            throw new Error('Not found item.')
        } else {
            const updateItem = await service.onUpdate(req.params.id, req.body)
            res.json(updateItem)
        }

    } catch (err) {
        res.error(err)
    }
})
module.exports = router
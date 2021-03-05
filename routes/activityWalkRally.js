const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/activityWalkRally')
const logger = require('../helpers/logger');
const myLogger = new logger()
//  เพิ่มข้อมูล WalkRally
router.post('/', [
    check('u_id').not().isEmpty(),
    check('u_username').not().isEmpty(),
], async (req, res) => {
    try{
        req.validate()
        await myLogger.writeInfo("addWalkRally", req, Date())
        res.json({ message: await service.onInsert(req.body) })
    }catch(err){
        await myLogger.writeError("addWalkRally", req, Date(), err)
        res.error(err)
    }
})
// แสดงข้อมูลตามรหัสนักศึกษา
router.get('/:id', [], async (req, res) => {
    try {
        const items = await service.findOne({ id: req.params.id })
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
module.exports = router
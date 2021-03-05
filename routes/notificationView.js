const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/notificationView')
//  เพิ่มข้อมูล
router.post('/', [
    check('u_id').not().isEmpty(),
    check('no_id').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate()
        const item = await service.onInsert(req.body);
        res.json({ message: item })
    } catch (err) {
        res.error(err)
    }
})

module.exports = router
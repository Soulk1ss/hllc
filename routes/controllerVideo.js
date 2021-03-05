const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/controllerVideo')
const { authenticatedAdmin } = require('../configs/security')
//  เพิ่มข้อมูลวิดีโอ
router.post('/', authenticatedAdmin, [
    check('admin_av_name').not().isEmpty(),
    check('admin_av_yt_id').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const item = await service.findOne({ admin_av_name: req.body.admin_av_name })
        if (!item) {
           
            res.json({ message: await service.onInsert(req.body) })
        } else {
           
            res.json({ message: await service.onUpdate(req.body) })
        }
    } catch (err) {
        res.error(err)
    }
})
//  ดึงข้อมูลวิดีโอ
router.get('/:name', [
], async (req, res) => {
    try {
        const item = await service.findOne({ admin_av_name: req.params.name })
        res.json(item)
    } catch (err) {
        res.error(err)
    }
})
module.exports = router
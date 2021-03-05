const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/controllerLiveStreaming')

//  เพิ่มข้อมูลวิดีโอ

router.post('/', [
    check('admin_als_pyt_id').not().isEmpty(),
    check('admin_als_yt_link').not().isEmpty(),
    check('admin_als_enable_done').not().isEmpty(),
    check('admin_als_enable_link').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const item = await service.find()
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
router.get('/', [
], async (req, res) => {
    try {
        const item = await service.find()
        res.json(item)
    } catch (err) {
        res.error(err)
    }
})
module.exports = router
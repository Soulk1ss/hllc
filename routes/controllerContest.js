const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/controllerContest')
const { authenticatedAdmin } = require('../configs/security')
// แสดงข้อมูลวิดีโอตามหน้า
router.post('/shuffle', async (req, res) => {
    try {
        res.json({ message: await service.shuffle() })
    } catch (err) {
        res.error(err)
    }
});
// แสดงข้อมูลวิดีโอทุกอัน
router.get('/', [
    check('page').not().isEmpty().isInt().toInt()
], async (req, res) => {
    try {
        req.validate()
        const items = await service.findAll(req.query)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
});

// แสดงข้อมูลวิดีโอตามหน้า
router.get('/vote', [
    check('page').not().isEmpty().isInt().toInt()
], async (req, res) => {
    try {
        req.validate()
        const items = await service.findByVote(req.query)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
});
router.get('/order', [
    // check('page').not().isEmpty().isInt().toInt()
], async (req, res) => {
    try {
        req.validate()
        const items = await service.findByOrder(req.query)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
});
//เพิ่ม ac_order
router.post('/order', [
    check('u_id').not().isEmpty().isInt().toInt(),
    check('ac_order').not().isEmpty().isInt().toInt(),
], async (req, res) => {
    try {
        req.validate()
        const item = await service.findOne({ id: req.body.u_id })
        if (!item) {
            throw new Error('Not found items.')
        } else {

            res.json({ message: await service.onOrder(req.body) })
        }


    } catch (err) {
        res.error(err)
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.json({ message: await service.findOne({ id: req.params.id }) })
    } catch (err) {
        res.error(err)
    }
});
// เพิ่มคลิป
router.post('/', authenticatedAdmin, [
    check('u_id').not().isEmpty(),
    check('ac_url').not().isEmpty(),
    check('ac_name').not().isEmpty(),
    check('ac_description').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate()
        const item = await service.findOne({ id: req.body.u_id })
        if (item) {
            throw new Error('รหัสนักศึกษาซ้ำ.')
        } else {

            res.json({ message: await service.onInsert(req.body) })
        }
    } catch (err) {
        res.error(err)
    }
});
// ลบคลิป
router.delete('/:id', authenticatedAdmin, async (req, res) => {
    try {
        const item = await service.findOne({ id: req.params.id })
        if (!item) {
            throw new Error('Not found item.')
        } else {
            const deleteItem = await service.onDelete(item.u_id)

            res.send(deleteItem)
        }
    } catch (err) {
        res.error(err)
    }
});
module.exports = router
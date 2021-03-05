const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/controllerInspiration')
const { authenticatedAdmin } = require('../configs/security')

//เรียกวิดีโอมาดู
router.get('/',[
    // check('page').not().isEmpty().isInt().toInt()
], async (req, res) => {
    try {
        req.validate()
        const items = await service.find(req.query)
        res.json(items)
    } catch (ex) { res.error(ex) }
})

//เพิ่มวิดีโอ
router.post('/', [
    check('ins_major').not().isEmpty(),
    check('ins_school').not().isEmpty(),
    //check('ac_type').not().isEmpty(),
    check('ins_url').not().isEmpty(),
    check('ins_name').not().isEmpty(),
    //check('ins_description').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate()
        const item = await service.findOne({ ins_school : req.body.ins_school,ins_major: req.body.ins_major })
        // if (item) throw new Error('มีวิดีโอถูกบันทึกอยู่แล้ว')
        if (!item) {
            res.json({ message: await service.onInsert(req.body) })
        } else {
            res.json({ message: await service.onUpdate(req.body) })
        }

    } catch (ex) {
        res.error(ex)
    }
})

//ค้นหาบุคคลจากสำนัก
router.get('/findOneBySchool/', [
    check('ins_school').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate()
        const item = await service.findOneBySchool({ ins_school: req.body.ins_school })
        if (!item) {
            throw new Error('Not found item.')
        } else {
            res.json(item)
        }
    } catch (err) {
        res.error(err)
    }
})

//ค้นหาบุคคลจากสาขา
router.get('/findOneBymajor/', [
    check('ins_major').not().isEmpty(),
], async (req, res) => {
    try {
       
        req.validate()
        const item = await service.findOneBymajor({ ins_major: req.query.ins_major,ins_school: req.query.ins_school })
        if (!item) {
            throw new Error('Not found item.')
        } else {
            res.json(item)
        }
    } catch (err) {
        res.error(err)
    }
})

//ค้นหาจากทั้งหมด
router.get('/findAll/',[
    check('aln_school').not().isEmpty(),
], async (req, res) => {
    //console.log(res.body)
    try {
        // req.validate()
        const item = await service.findAll({ aln_school: req.body.ins_school })
        if (!item) throw new Error('Not found item.')
        res.json(item)
    } catch (ex) {
        res.error(ex)
    }
})

// update ข้อมูลการดูวิดีโอ
router.put('/update/', [
    check('ins_school').not().isEmpty(),
    check('ins_name').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const item = await service.findOne({ aln_major: req.body.ins_major })
        if (!item) throw new Error('Not found item.')
        const updateItem = await service.onUpdate(req.body)
        res.json(updateItem)
    } catch (ex) {
        res.error(ex)
        
    }
})
router.delete('/:id', authenticatedAdmin, async (req, res) => {
    try {
        const item = await service.findOneByID(req.params.id)
        if (!item) {
            throw new Error('Not found item.')
        } else {
            const deleteItem = await service.onDelete(item._id)
            res.send(deleteItem)
        }
    } catch (err) {
        res.error(err)
    }
});
module.exports = router

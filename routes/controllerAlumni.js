const router = require('express').Router()
const { check } = require('express-validator')
const fs = require('fs')
const service = require('../services/controllerAlumni')
const base64Img = require('base64-img')
const path = require('path')
const uploadDir = path.resolve('uploads')
const imageDir = path.join(uploadDir, 'alumni')
const { authenticatedAdmin } = require('../configs/security')
//เรียกวิดีโอมาดู
router.get('/', [
    // check('page').not().isEmpty().isInt().toInt()
], async (req, res) => {
    try {

        const items = await service.find(req.query)
        for (var i = 0; i < items.result.length; i++) {

            if (items.result[i].aln_img != undefined && items.result[i].aln_img != "") {
                items.result[i].aln_img = base64Img.base64Sync(path.join(imageDir, items.result[i].aln_img))
            } else {
                items.result[i].aln_img = ""
            }

            //console.log(base64Img.base64Sync(path.join(imageDir, items.result[i].aln_img)));
        }

        res.json(items)
    } catch (err) {
        res.error(err)
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
//เพิ่มวิดีโอ
router.post('/', [
    check('aln_major').not().isEmpty(),
    check('aln_school').not().isEmpty(),
    //check('aln_url_id').not().isEmpty(),
    check('aln_name').not().isEmpty(),
    check('aln_description').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate()

        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
        if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir)

        if (req.body.aln_img) {
            req.body.aln_img = base64Img.imgSync(req.body.aln_img, imageDir, `${req.body.aln_school}-${req.body.aln_major}-${Date.now()}`).replace(`${imageDir}/`, '')
        }

        const item = await service.findOneBymajor(req.body)
        if (item == null || Object.keys(item).length == 0) {
            res.json({ message: await service.onInsert(req.body) })
        } else {
            res.json({ message: await service.onUpdate(req.body) })
        }

    } catch (ex) {
        res.error(ex)
    }
})

//ค้นหาข้อมูลจากสำนัก
router.get('/findOneBySchool/', [
    check('aln_school').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate()
        const item = await service.findOneBySchool({ aln_school: req.body.aln_school })
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
    check('aln_major').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate()
        //console.log(req.query)
        const item = await service.findOneBymajor({ aln_major: req.query.aln_major, aln_school: req.query.aln_school })
        if (!item) {
            throw new Error('Not found item.')
        } else {
            if (item.aln_img != undefined && item.aln_img != "") {
                item.aln_img = base64Img.base64Sync(path.join(imageDir, item.aln_img))
            }
            res.json(item)
        }
    } catch (err) {
        res.error(err)
    }
})

//ค้นหาจากทั้งหมด
router.get('/findAll/', [
    // check('aln_school').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate()
        const item = await service.findAll({})

        if (!item) {
            throw new Error('Not found item.')
        } else {
            for (var i = 0; i < items.result.length; i++) {
                items.result[i].aln_img = base64Img.base64Sync(path.join(imageDir, items.result[i].aln_img))
            }
            res.json(item)
        }

    } catch (err) {
        res.error(err)
    }
})

// update ข้อมูลการดูวิดีโอ
router.put('/update/', [
    check('aln_school').not().isEmpty(),
    check('aln_name').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const item = await service.findOne({ aln_major: req.body.aln_major })
        if (!item) throw new Error('Not found item.')
        const updateItem = await service.onUpdate(req.body)
        res.json(updateItem)
    } catch (ex) {
        res.error(ex)
    }
})
module.exports = router

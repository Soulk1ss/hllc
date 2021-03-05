const router = require('express').Router()
const { check } = require('express-validator')
const fs = require('fs')
const base64Img = require('base64-img')
const service = require('../services/activityPainting')
const path = require('path')
const uploadDir = path.resolve('uploads')
const imageDir = path.join(uploadDir, 'activityPainting')
const logger = require('../helpers/logger');
const myLogger = new logger()
//  เพิ่มข้อมูลรูปภาพ
router.post('/', [
    check('u_id').not().isEmpty(),
    check('u_username').not().isEmpty(),
    check('acp_image').not().isEmpty(),
    check('acp_moto').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
        if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir)
        req.body.acp_image = base64Img.imgSync(req.body.acp_image, imageDir, `${req.body.u_id}-${Date.now()}`).replace(`${imageDir}/`, '')
        await myLogger.writeInfo("addPainting", req, Date())
        res.json({ message: await service.onInsert(req.body) })
    } catch (err) {
        await myLogger.writeError("addPainting", req, Date(), err)
        res.error(err)
    }

})
//  แสดงข้อมูลทั้งหมด
router.get('/', [

], async (req, res) => {
    try {
        const items = await service.find(req.query)
        for (var i = 0; i < items.result.length; i++) {
            items.result[i].acp_image = base64Img.base64Sync(path.join(imageDir, items.result[i].acp_image))
        }
       
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
//  แสดงข้อมูลรูปภาพตาม id
router.get('/:id', [], async (req, res) => {
    try {
        const items = await service.findOne({ id: req.params.id })
        if (items) items.acp_image = base64Img.base64Sync(path.join(imageDir, items.acp_image))
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
// แก้ไขข้อมูลรูปภาพ
router.put('/:id', [
    check('acp_image').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const item = await service.findOne({ id: req.params.id })
        if (!item) throw new Error('Not found item.')

        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
        if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir)

        // แปลงข้อมูลรูปภาพ
        req.body.acp_image = base64Img.imgSync(req.body.acp_image, imageDir, `${req.params.id}-${Date.now()}`).replace(`${imageDir}/`, '')
        const updateItem = await service.onUpdate(req.params.id, req.body)
        // ตรวจสอบว่าแก้ไขข้อมูลได้หรือไม่ ถ้าได้ให้ลบรูปเดิม
        if (updateItem) {
            if (item.acp_image) {
                const deleteImg = path.join(imageDir, item.acp_image)
                if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null)
            }
        }
        
        res.json(updateItem)
    } catch (err) {
        res.error(err)
    }
})
module.exports = router
const router = require('express').Router()
const { check } = require('express-validator')
const fs = require('fs')
const base64Img = require('base64-img')
const service = require('../services/activityFlower')
const serviceSurway = require('../services/surway')
const path = require('path')
const uploadDir = path.resolve('uploads')
const imageDir = path.join(uploadDir, 'activityFlower')
const logger = require('../helpers/logger');
const { authenticated, authenticatedAdmin } = require('../configs/security')
const myLogger = new logger()
//  เพิ่มข้อมูลรูปภาพ
router.post('/', authenticated, [
    check('u_id').not().isEmpty(),
    check('u_username').not().isEmpty(),
    check('af_image').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
        if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir)

        //ใช้ Linux--------
        req.body.af_image = base64Img.imgSync(req.body.af_image, imageDir, `${req.body.u_id}-${Date.now()}`).replace(`${imageDir}/`, '')
        //ใช้ windows--------
        //req.body.af_image = base64Img.imgSync(req.body.af_image, imageDir, `${req.body.u_id}-${Date.now()}`).replace(imageDir,'').replace("\\", "")
        //await myLogger.writeInfo("activityFlowerAdd", req, Date())
        //shape(inputFilePath).resize({ height:200 }).toFile(outputFilePath)
        res.json({ message: await service.onInsert(req.body) })
        
    } catch (err) {
        await myLogger.writeError("activityFlowerAdd", req, Date(), err)
        res.error(err)
    }
})
// แสดงข้อรูปภาพตามหน้า

router.get('/', [
    check('page').not().isEmpty().isInt().toInt()
], async (req, res) => {
    try {
        req.validate()
        const items = await service.find(req.query)
        for (var i = 0; i < items.result.length; i++) {
            if (fs.existsSync(path.join(imageDir, items.result[i].af_image))) {
                items.result[i].af_image = base64Img.base64Sync(path.join(imageDir, items.result[i].af_image))
            }
        }

        res.json(items)
    } catch (err) {
        res.error(err)
    }

})

// แสดงข้อมูลตามรหัสนักศึกษา
router.get('/:id', [], async (req, res) => {
    try {
        const items = await service.findOne({ id: req.params.id })
        if (items !== undefined) {
            items.af_image = base64Img.base64Sync(path.join(imageDir, items.af_image))
        }
        await myLogger.writeInfo("activityFlowerGetData", req, Date())
        res.json(items)
    } catch (err) {
        await myLogger.writeError("activityFlowerGetData", req, Date(), err)
        res.error(err)
    }
})

// แก้ไขรูปภาพ
router.put('/:id', authenticated, [
    check('af_image').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const item = await service.findOne({ id: req.params.id })
        if (!item) throw new Error('Not found item.')

        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
        if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir)

        // แปลงข้อมูลรูปภาพ

        //ใช้ windows--------
        //req.body.af_image = base64Img.imgSync(req.body.af_image, imageDir, `${req.params.id}-${Date.now()}`).replace(imageDir, '').replace("\\", "")

        //ใช้ macbook ios------
        req.body.af_image = base64Img.imgSync(req.body.af_image, imageDir, `${req.body.u_id}-${Date.now()}`).replace(`${imageDir}/`, '')

        // req.body.af_image = af_image;
        // console.log(af_image);
        const updateItem = await service.onUpdate(req.params.id, req.body)
        // ตรวจสอบว่าแก้ไขข้อมูลได้หรือไม่ ถ้าได้ให้ลบรูปเดิม
        if (updateItem) {
            if (item.af_image) {
                const deleteImg = path.join(imageDir, item.af_image)
                if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null)
            }

        }
        await myLogger.writeInfo("activityFlowerUpdate", req, Date())
        res.json(updateItem)
    } catch (err) {
        await myLogger.writeError("activityFlowerUpdate", req, Date(), err)
        res.error(err)
    }
})
// ลบข้อมูลรูปภาพ
router.delete('/:id', authenticatedAdmin, async (req, res) => {
    try {
        const item = await service.findOneByObjID(req.params.id)
        if (!item) {
            throw new Error('Not found item.')
        } else {
            const deleteItem = await service.onDeleteByObjID(item._id)
            const deleteImg = path.join(imageDir, item.af_image)
            if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null)
            
            res.send(deleteItem)
        }
    } catch (err) {
        res.error(err)
    }
})
module.exports = router

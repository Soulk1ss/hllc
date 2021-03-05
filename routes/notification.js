const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/notification')
//  เพิ่มข้อมูล
router.post('/', [
    check('no_titie').not().isEmpty(),
    check('no_message').not().isEmpty(),
], async (req, res) => {
    try {
        //req.validate()
        //console.log(req.body)
        const item = await service.onInsert(req.body);
        res.json({ message: item })
    } catch (err) {
        res.error(err)
    }
})
router.get('/', [
    check('page').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const items = await service.find(req.query)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
router.get('/all', [], async(req, res) => {
    try {
        const items = await service.findAll()
        //console.log(items)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
router.get('/byID', [], async(req, res)=>{
    try {
        const items = await service.findByID(req.query.id)
        res.json(items)
    } catch(err){
        res.error(err)
    }
})
router.delete('/', async (req, res) => {
    console.log(req.query)
    try {
        const item = await service.findOne(req.query)
        if (!item) {
            throw new Error('Not found item.')
        } else {
            const deleteItem = await service.onDelete(item)
            console.log("complete")
            res.json(deleteItem)
        }
    } catch (err) {
        res.error(err)
    }
})

module.exports = router

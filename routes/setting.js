const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/setting')

router.post('/', [

], async (req, res) => {
    try {
        req.validate()
        const check = await service.find({})
        if(!check){
            item = await service.onStart(req.body) 
        }else{
            item = await service.onUpdate(req.body)
        }
        res.json(item)
    } catch (ex) {
        res.error(ex)
    }
})

router.get('/', [

], async (req, res) => {
    try {
        req.validate()
        const item = await service.find({})
        if (!item) throw new Error('Not found item.')
        // const updateItem = await service.onChange(req.body)
        res.json(item)
    } catch (ex) {
        res.error(ex)
    }
})

module.exports = router;
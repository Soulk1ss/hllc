const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/account')
const { onUpdate } = require('../services/activityVideo')

//getAlluser
router.get('/all', [
    check('page').not().isEmpty()
], async (req, res) => {
    try {
        const items = await service.getAllStudent(req.query)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
//getuserByID
router.get('/id', [
    // check('activity').not().isEmpty()
], async (req, res) => {
    try {
        console.log(req.query.search_text)
        const items = await service.getStudentById({ id:req.query.search_text })
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
//update
router.put('/', [
    // check('activity').not().isEmpty()
], async (req, res) => {
    try {
        const items = await service.onUpdateData(req.body)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
module.exports = router

const router = require('express').Router()
const service = require('../services/activityDinner')
router.get('/', async (req, res) => {
    try {
        const items = await service.getConversation()
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
module.exports = router
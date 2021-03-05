const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/activityContest')
const { authenticatedAdmin } = require('../configs/security')
const logger = require('../helpers/logger');
const myLogger = new logger()
// โหวตวิดีโอ
router.post('/', [
    check('acv_u_id').not().isEmpty(),
    check('ac_id').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        await myLogger.writeInfo("voteVideo", req, Date())
        res.json({ message: await service.onVote(req.body) })
    } catch (err) {
        await myLogger.writeError("voteVideo", req, Date(), err)
        res.error(err)
    }
})
// แสดงคลิปที่ให้โหวต
router.get('/contest', [], async (req, res) => {
    try {
        const items = await service.findContest(req.query)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
// นับจำนวนโหวต
router.get('/group/', async (req, res) => {
    try {
        const item = await service.groupByClipID()
        const items = item.sort(function (a, b) {
            if (a.total > b.total) { return -1; }
            if (a.total < b.total) { return 1; }
            return 0;
        })

        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
// นับจำนวนโหวต
router.get('/votepoint/', async (req, res) => {
    try {
        const items = await service.findRank()
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
// นับโหวตตาม u_id ของผู้โหวต
router.get('/voter/:id', async (req, res) => {
    try {
        const items = await service.findByUID(req.params.id)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
// นับโหวตตาม u_id ของเจ้าของคลิป
router.get('/clip/:id', async (req, res) => {
    try {
        const items = await service.findByClipID(req.params.id)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
module.exports = router
const router = require('express').Router()
const { check } = require('express-validator')
const serviceAccount = require('../services/account')
const serviceVideo = require('../services/activityVideo')
const serviceFlower = require('../services/activityFlower')
const serviceWalkRally = require('../services/activityWalkRally')
const servicePainting = require('../services/activityPainting')
const serviceSchool = require('../services/activitySchool')
const serviceVoter = require('../services/activityContest')
const logger = require('../helpers/logger');
const myLogger = new logger();
const { authenticated, authenticatedAdmin } = require('../configs/security')

// Add new user
router.post('/register', [
    check('u_id').not().isEmpty(),
    check('u_username').not().isEmpty(),
    check('u_password').not().isEmpty(),
    check('u_faculty').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const created = await serviceAccount.onRegister(req)
        res.json(req.body)
    } catch (err) {
        res.error(err)
    }
})
// user login
router.post('/login', [
    check('u_id').not().isEmpty(),
    check('u_password').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const created = await serviceAccount.onLogin(req)
        //await myLogger.writeInfo("accountLogin", req, Date())
        req.session.userLogin = created
        res.json(created)
    } catch (err) {
        await myLogger.writeError("accountLogin", req, Date(), err)
        res.error(err)
    }
})
// Get User Login Session
router.post('/getUserLogin', (req, res) => {
    try {
        res.json(req.session.userLogin)
    } catch (err) {
        res.error(err, 401)
    }
})
//Delete Session
router.post('/logout', (req, res) => {
    try {
        delete req.session.userLogin
        res.json({ message: 'logout' })
    } catch (err) {
        res.error(err)
    }
})


router.get('/activity', async (req, res) => {
   
    try {
        const data = []
        const activity = []
        const activitys = await serviceAccount.onSummary(req.query.dataLimit)
        for (let n in activitys[0].activity) {
            activity.push({
                name: activitys[0].activity[n].name,
                sum: 0
            })
        }

        for (var i = 0; i < activitys.length; i++) {
            for (let n in activitys[i].activity) {
                if (activitys[i].activity[n].done == 1) {
                    activity[n].sum++;
                }

            }
        }
        res.json({ message: activity })
    } catch (err) {
        res.error(err)
    }
})

router.get('/summary', async (req, res) => {
    try {
       
        res.json({ message: await serviceAccount.onSummary(req.query.dataLimit) })
    } catch (err) {
        res.error(err)
    }
})
//Get user progress by id
router.get('/progress', [
    check('id').not().isEmpty()
], authenticated, async (req, res) => {
    try {
        req.validate()
        const result = await getProgress(req)
        res.json(result)
    } catch (err) {
        res.error(err)
    }
})
router.get('/:id', [], authenticated, async(req, res) => {
    try{
        res.json(await serviceAccount.onFindByID(req.params.id))
    }catch(err){
        res.error(err)
    }
})
// Edit user in Admin > User page
router.post('/onUpdateData', [
    check('u_username').not().isEmpty(),
    check('u_lastname').not().isEmpty(),
    check('u_password').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const item =  serviceAccount.onUpdateData(req.body)
        res.json(item)
    } catch (err) {
        res.error(err)
    }
})

//Update user thumbnail
router.put('/:id', [
    check('thumbnail').not().isEmpty()
], authenticated, async (req, res) => {
    try {
        req.validate()
        await myLogger.writeInfo("accountUpdate", req, Date())
        res.json({ message: await serviceAccount.onUpdate(req) })
    } catch (err) {
        await myLogger.writeError("accountUpdate", req, Date(), err)
        res.error(err)
    }
})

//View user
router.post('/view', [
    // check('view').not().isEmpty()
], async (req, res) => {
    try {
        console.log(req.body)
        req.validate()
        await myLogger.writeInfo("accountUpdate", req, Date())
        res.json({ message: await serviceAccount.onView({ id: req.body.Id }) })
    } catch (err) {
        await myLogger.writeError("accountUpdate", req, Date(), err)
        res.error(err)
    }
})

async function getProgress(req) {
    const u_id = req.query.id
    var activity = []
    activity[1] = await serviceVideo.findOne({ id: u_id, av_name: 'Follow The Path' })
    activity[2] = await serviceFlower.findOne({ id: u_id })
    activity[3] = await serviceWalkRally.findOne({ id: u_id })
    activity[4] = await serviceVideo.findOne({ id: u_id, av_name: 'Khantok' })
    activity[5] = await serviceVideo.findOne({ id: u_id, av_name: 'Set Your Goal' })
    activity[6] = await serviceVideo.findOne({ id: u_id, av_name: 'Smart Learner' })
    activity[7] = await serviceVideo.findOne({ id: u_id, av_name: 'Teen Lesson' })
    activity[8] = await serviceSchool.findOne(u_id)
    activity[9] = await serviceVideo.findOne({ id: u_id, av_name: 'Inspiration' })
    activity[10] = await servicePainting.findOne({ id: u_id })
    activity[11] = await serviceVideo.findOne({ id: u_id, av_name: 'Alumni' })
    activity[12] = await serviceVoter.findByUID(u_id)
    var activityTmp = [
        { id: "activity1", progress: true, name: "Follow The Path", done: (activity[1]) ? 1 : 0 },
        { id: "activity2", progress: true, name: "Lamduan Flower", done: (activity[2]) ? 1 : 0 },
        { id: "activity3", progress: true, name: "Walk Rally", done: (activity[3]) ? 1 : 0 },
        { id: "activity4", progress: true, name: "Khantok", done: (activity[4]) ? 1 : 0 },
        { id: "activity5", progress: true, name: "Set Your Goal", done: (activity[5]) ? 1 : 0 },
        { id: "activity6", progress: true, name: "Smart Learner", done: (activity[6]) ? 1 : 0 },
        { id: "activity7", progress: true, name: "Teen Lesson", done: (activity[7]) ? 1 : 0 },
        { id: "activity8", progress: false, name: "School", done: (activity[8]) ? 1 : 0 },
        { id: "activity9", progress: true, name: "Inspiration", done: (activity[9]) ? 1 : 0 },
        { id: "activity10", progress: true, name: "Painting", done: (activity[10]) ? 1 : 0 },
        { id: "activity11", progress: true, name: "Alumni", done: (activity[11]) ? 1 : 0 },
        { id: "activity12", progress: true, name: "Content Contest", done: (activity[12].voteNum > 0) ? 1 : 0 }
    ]

    var count = 0
    var countAll = 0;
    for (var i = 0; i < activityTmp.length; i++) {
        if (activityTmp[i].progress) {
            countAll++;
            count += activityTmp[i].done
        }

    }
    count = (count / countAll) * 100
    const result = {
        "u_id": u_id,
        "activity": activityTmp,
        "progress": count.toFixed(2)
    }
    return result
}
module.exports = router

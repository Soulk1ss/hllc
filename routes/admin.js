const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/admin')
const contest = require('../services/activityContest')
const { authenticatedAdmin } = require('../configs/security')

// Add new user
router.post('/register', [
    check('u_username').not().isEmpty(),
    check('u_password').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const created = await service.onRegister(req.body)
        res.json(created)
    } catch (err) {
        res.error(err)
    }
})
// user login
router.post('/login', [
    check('u_username').not().isEmpty(),
    check('u_password').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const created = await service.onLogin(req)
        req.session.userAdmin = created
        
        res.json(created)
    } catch (err) {
        res.error(err)
    }
})
router.post('/getAdminLogin', authenticatedAdmin, (req, res) => {
    try {
        res.json(req.session.userAdmin)
    } catch (err) {
        res.error(err, 401)
    }
})
router.post('/logout',(req, res)=>{
    try{
        delete req.session.userAdmin
        res.json({ message: 'logout' })
    }catch(err){
        res.error(err)
    }
})
module.exports = router
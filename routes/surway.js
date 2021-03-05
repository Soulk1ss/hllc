const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../services/surway')
const logger = require('../helpers/logger');
const myLogger = new logger()
const activity = [
    {
        value: "Follow The Path"
    },
    {
        value: "Lamduan Flower"
    },
    {
        value: "Walk Rally"
    },
    {
        value: "Khantok"
    },
    {
        value: "Set Your Goal"
    },
    {
        value: "Smart Learner"
    },
    {
        value: "Teen Lesson"
    },
    {
        value: "School"
    },
    {
        value: "Inspiration"
    },
    {
        value: "Painting"
    },
    {
        value: "Alumni"
    },
    {
        value: "Content Contest"
    }
]
//  เพิ่มข้อมูลแบบสำรวจ
router.post('/', [
    check('u_id').not().isEmpty(),
    check('u_username').not().isEmpty(),
    check('s_activity').not().isEmpty(),
    check('s_rating').not().isEmpty().isInt().toInt(),
    check('s_comment').exists()
], async (req, res) => {
    try {
        req.validate()
        await myLogger.writeInfo("surway", req, Date())
        res.json({ message: await service.onInsert(req.body) })
    } catch (err) {
        await myLogger.writeError("surway", req, Date(), err)
        res.error(err)
    }
})
router.get('/all', [
    // check('activity').not().isEmpty()
], async (req, res) => {
    try {
        const items = await service.findAll(req.query)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
router.get('/rating/', [
], async (req, res) => {
    
    try {
        //console.log(activity)
        let loop = activity;
        const data = []
        for (let i in loop) {
            const result = await service.findByActivity({ s_activity: loop[i].value })
            if (result.result == "") {
                let name = loop[i].value
                let rate = { one: 0, two: 0, three: 0, four: 0, five: 0 }
                data[i] = { activity: name, rating: rate }
            } else {
                data[i] = Rating(result);
            }
        }
       
        res.json(data)
    } catch (err) {
        res.error(err)
    }
})
router.get('/findByActivity/', [
    check('s_activity').not().isEmpty(),
], async (req, res) => {
    //console.log(req.body)
    try {
        req.validate()
        const item = await service.findByActivity({ s_activity: req.body.s_activity })
        if (!item) {
            throw new Error('Not found item.')
        } else {
           
            res.json(item)
        }
    } catch (err) {
        res.error(err)
    }
})
router.get('/all/activity', [
    check('activity').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const items = await service.findByActivity(req.query)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
router.get('/all/:id', [
    // check('activity').not().isEmpty()
], async (req, res) => {
    try {
        const items = await service.findById({ id: req.params.id })
        res.json(items)
    } catch (err) { 
        res.error(err) 
    }
})
// แสดงข้อมูล surway ทั้งหมดตาม uid และกิจกรรม
router.get('/:id', [
    check('activity').not().isEmpty()
], async (req, res) => {
    try {
        req.validate()
        const items = await service.findOne({ id: req.params.id, activity: req.query.activity })
        res.json(items)
    } catch (err) {
        res.error(err) 
    }
})
router.delete('/', async (req, res) => {
    try {
        const item = await service.findByIdAndActivity(req.query)
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

function Rating(value) {
    let rating = {
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0
    };
    for (let i in value.result) {
        if (value.result[i].s_rating == 1) {
            rating.one++;
        } else if (value.result[i].s_rating == 2) {
            rating.two++;
        } else if (value.result[i].s_rating == 3) {
            rating.three++;
        } else if (value.result[i].s_rating == 4) {
            rating.four++;
        } else if (value.result[i].s_rating == 5) {
            rating.five++;
        }
    }
    const result = {
        activity: value.result[0].s_activity,
        rating: rating
    }
    return result
}

module.exports = router
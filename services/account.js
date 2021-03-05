const connection = require('../configs/database')
const { password_hash, password_verify, isEmpty } = require('../configs/security')
const serviceVideo = require('../services/activityVideo')
const activityContest = require('../services/activityContest')

const modelActivityContest = activityContest.modelActivityContest
const modelUser = connection.model('User', {
    u_id: String,
    u_password: String,
    u_username: String,
    u_lastname: String,
    u_nickname: String,
    u_school: String,
    u_major: String,
    u_blood: String,
    u_religion: String,
    u_thumbnail: String,
    u_view: String
})
module.exports = {
    onRegister(req) {
        const value = req.body;
        return new Promise((resolve, reject) => {
            value.u_password = password_hash(value.u_password)
            // create instance from user
            const newUser = new modelUser({
                u_id: value.u_id,
                u_username: value.u_username,
                u_password: value.u_password,
                u_faculty: value.u_faculty
            })
            // save to database (return as Promise)
            newUser.save().then(res => resolve({ status: 'registered' })).catch(err => reject({ status: 'cannot registered' }))
        })
    },
    onGroupActivity() {
        return new Promise((resolve, reject) => {
            modelUser.find().countDocuments().then(res => {
                resolve(res)
            }).catch(err => reject(err))
        })
    },
    onSummary(limitData) {
        console.log(limitData)
        var endRow = parseInt(limitData)
        var startRow = endRow - 1000
       
        return new Promise((resolve, reject) => {
            modelUser.aggregate([
                {
                    $sort: {
                        u_id: 1
                    }
                },
                { $skip: startRow },
                { $limit: 1000 },
                {
                    $lookup: {
                        from: "activitycontests", // collection name in db
                        localField: "u_id",
                        foreignField: "acv_u_id",
                        as: "acv"
                    },

                },
                { $unwind: { path: '$acv', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "activitypaintings", // collection name in db
                        localField: "u_id",
                        foreignField: "u_id",
                        as: "acp"
                    },

                },
                { $unwind: { path: '$acp', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "activityflowers", // collection name in db
                        localField: "u_id",
                        foreignField: "u_id",
                        as: "af"
                    },

                },
                { $unwind: { path: '$af', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "activitywalkrallies", // collection name in db
                        localField: "u_id",
                        foreignField: "u_id",
                        as: "aw"
                    },

                },
                { $unwind: { path: '$aw', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "activityvideos", // collection name in db
                        localField: "u_id",
                        foreignField: "u_id",
                        as: "av"
                    },

                },
                { $unwind: { path: '$av', preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: "$_id",
                        u_id: { "$first": "$u_id" },
                        acp: { "$first": "$acp._id" },
                        af: { "$first": "$af._id" },
                        aw: { "$first": "$aw._id" },
                        acv: { "$first": "$acv._id" },
                        av: { $push: "$av" },

                    }
                },

                {
                    $project: {
                        "u_id": 1,
                        "activity": [
                            {
                                id: "activity1",
                                name: "Follow The Path",
                                done: { $cond: { if: { $in: ["Follow The Path", "$av.av_name"] }, then: 1, else: 0 } }
                            },
                            {
                                id: "activity2",
                                name: "Lamduan Flower",
                                //done: "$af"
                                done: { $cond: { if: { $ne: ["$af", null] }, then: 1, else: 0 } }
                            },
                            {
                                id: "activity3",
                                name: "Walk Rally",
                                //done: "$af"
                                done: { $cond: { if: { $ne: ["$aw", null] }, then: 1, else: 0 } }
                            },
                            {
                                id: "activity4",
                                name: "Khantok",
                                done: { $cond: { if: { $in: ["Khantok", "$av.av_name"] }, then: 1, else: 0 } }
                            },
                            {
                                id: "activity5",
                                name: "Set Your Goal",
                                done: { $cond: { if: { $in: ["Set Your Goal", "$av.av_name"] }, then: 1, else: 0 } }
                            },
                            {
                                id: "activity6",
                                name: "Smart Learner",
                                done: { $cond: { if: { $in: ["Smart Learner", "$av.av_name"] }, then: 1, else: 0 } }
                            },
                            {
                                id: "activity7",
                                name: "Teen Lesson",
                                done: { $cond: { if: { $in: ["Teen Lesson", "$av.av_name"] }, then: 1, else: 0 } }
                            },
                            {
                                id: "activity9",
                                name: "Inspiration",
                                done: { $cond: { if: { $in: ["Inspiration", "$av.av_name"] }, then: 1, else: 0 } }
                            },
                            {
                                id: "activity10",
                                name: "Painting",
                                done: { $cond: { if: { $ne: ["$acp", null] }, then: 1, else: 0 } }
                            },
                            {
                                id: "activity11",
                                name: "Alumni",
                                done: { $cond: { if: { $in: ["Alumni", "$av.av_name"] }, then: 1, else: 0 } }
                            },
                            {
                                id: "activity12",
                                name: "Content Contest",
                                done: { $cond: { if: { $ne: ["$acv", null] }, then: 1, else: 0 } }
                            },

                        ]

                    }
                }
                
            ]).exec(function (error, res) {
                if (error) {
                    reject(error)
                } else {
                    resolve(res)
                }
            })

        })
    },
    getAllStudent(value) {
        return new Promise((resolve, reject) => {
            const limitPage = 200
            const startPage = ((value.page || 1) - 1) * limitPage
            const items = { result: [], rows: 0, limit: limitPage }
            var query = {};
            if (value.search_key && value.search_text) {
                query[value.search_key] = { '$regex': value.search_text, '$options': 'i' }
            }
            modelUser.find(query).skip(startPage).sort('u_id').limit(limitPage).then(result => {
                items.result = result
                modelUser.find(query).countDocuments().then(count => {
                    items.rows = count
                    resolve(items)
                }).catch(err => reject(err))
                //resolve(res)
            }).catch(err => reject(err))
        })
    },
    onUpdate(req) {
        const value = req.body
        return new Promise((resolve, reject) => {
            var conditions = { u_id: value.id }
                , update = {
                    u_thumbnail: value.thumbnail
                }
                , options = { multi: true };
            modelUser.updateOne(conditions, update, options).exec(function (error, res) {
                if (error) {
                    reject(error)
                } else {
                    resolve(res)
                }
            })

        })
    },
    onUpdateData(value){
        return new Promise((resolve, reject) => {
            var conditions = { u_id: value.u_id }
                , update = {
                    u_password: value.u_password,
                    u_username: value.u_username,
                    u_lastname: value.u_lastname,
                },
                options = { multi: true };
            modelUser.updateOne(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
           
        })
    },
    onLogin(req) {
        const value = req.body;
        console.log(req.body)
        return new Promise((resolve, reject) => {
            modelUser.find({ u_id: value.u_id, u_password: value.u_password }).select('-u_password').exec(function (error, res) {
                if (error) {
                    reject(error)
                } else {
                    if (isEmpty(res)) {
                        resolve({ message: 'Authen fail' })
                    } else {
                        resolve(res[0])
                    }
                }

            })
        })
    },
    onFindByID(id){
        return new Promise((resolve, reject) => {
            modelUser.findOne({ u_id: id }).exec(function (error, res) {
                if (error) {
                    reject(error)
                } else {
                    resolve(res)
                }
            })
        })
    },
    onView(value) {
        //console.log(req.body)
        return new Promise((resolve, reject) => {
            var conditions = { u_id: value.id }
                , update = {
                    u_view: 1
                }
                , options = { multi: true };
            modelUser.updateOne(conditions, update, options).exec(function (error, res) {
                if (error) {
                    reject(error)
                } else {
                    resolve(res)
                }
            })
        })
    }

}

const connection = require('../configs/database')
const modelNotification = connection.model('notification', {
    no_title: String,
    no_message: String,
    no_url: String,
    no_updated: Date
})
module.exports = {
    onInsert(value) {
        return new Promise((resolve, reject) => {
            const newNotification = new modelNotification({
                no_title: value.no_title,
                no_message: value.no_message,
                no_url:value.no_url,
                no_updated: Date.now()
            })
            // save to database (return as Promise)
            newNotification.save().then(res => resolve({ status: 'inserted' })).catch(err => reject({ status: 'cannot inserted' }))
        })
    },
    find(value) {
        return new Promise((resolve, reject) => {
            const limitPage = 20
            const startPage = ((value.page || 1) - 1) * limitPage
            const items = { result: [], rows: 0, limit: limitPage }
            var query = {};
            if (value.search_key && value.search_text) {
                query[value.search_key] = { '$regex': value.search_text, '$options': 'i' }
            }
            modelNotification.find(query).skip(startPage).sort({ 'no_updated': -1 }).limit(limitPage).then(result => {
                items.result = result
                modelNotification.find(query).countDocuments().then(count => {
                    items.rows = count
                    resolve(items)
                }).catch(err => reject(err))
                //resolve(res)
            }).catch(err => reject(err))
        })
    },
    findOne(value) {
        return new Promise((resolve, reject) => {
            var query = {};
            query['_id'] = value._id
            modelNotification.find(query).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    findByID(id) {
        return new Promise((resolve, reject) => {
            modelNotification.aggregate([
                {
                    $lookup: {
                        from: "notificationviews", // collection name in db
                        //let: { "u_id": "$u_id" },
                        localField: "_id",
                        foreignField: "no_id",
                        //pipeline: [{ "$match": { "$expr": { "$eq": ["$$u_id", "6231210040"] } } }],
                        as: "view"
                    },
                },
                {
                    "$addFields": {
                        "view": {
                            "$filter": {
                                "input": "$view",
                                "cond": { "$eq": ["$$this.u_id", id] }
                            }
                        }
                    }
                },
                {
                    $unwind: { path: '$view', preserveNullAndEmptyArrays: true }
                },

            ]).exec(function (error, res) {

                //console.log(res)
                if (error) {
                    reject(error)
                } else {
                    resolve(res)
                }
            })
            /*
            modelNotification.find().then(result => {
                resolve(result)
            }).catch(err => reject(err))
            */
        })
    },
    findAll(value) {
        return new Promise((resolve, reject) => {
            modelNotification.find().then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    // ลบข้อมูล
    onDelete(value) {
        console.log(value)
        return new Promise((resolve, reject) => {
            modelNotification.deleteOne({
                _id: value[0]._id
            }).then(result => {
                console.log(result)
                resolve(result)
            }).catch(err => reject(err))
        })
    }
}

const connection = require('../configs/database')
const modelSurway = connection.model('Surway', {
    u_id: String,
    u_username: String,
    s_activity: String,
    s_rating: Number,
    s_comment: String,
    s_updated: Date
})
module.exports = {
    onInsert(value) {
        return new Promise((resolve, reject) => {
            const newS = new modelSurway({
                u_id: value.u_id,
                u_username: value.u_username,
                s_activity: value.s_activity,
                s_rating: value.s_rating,
                s_comment: value.s_comment,
                s_updated: Date.now()
            })
            newS.save().then(res => resolve(newS)).catch(err => reject(err))
        })
    },
    find(value) {
        return new Promise((resolve, reject) => {
            var query = {};
            // query['u_id'] = value.id
            
            modelSurway.find({ u_id: value.id }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    findOne(value) {
        return new Promise((resolve, reject) => {
            var query = {};
            query['u_id'] = value.id
            if (value.activity) {
                query['s_activity'] = { '$regex': value.activity, '$options': 'i' }
            }
            modelSurway.find(query).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    findById(value) {
        return new Promise((resolve, reject) => {
            var query = {};
            // query['u_id'] = value.id
            
            modelSurway.find({ u_id: value.id }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    findByIdAndActivity(value) {
        return new Promise((resolve, reject) => {
            var query = {};
            // query['u_id'] = value.id
            
            modelSurway.find({ u_id: value.id,s_activity : value.s_activity}).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    findRatingActivity(value) {
        return new Promise((resolve, reject) => {
            var query = {};
            // query['u_id'] = value.id
            //console.log(value)
            modelSurway.find({ s_activity: value.s_activity }).then(ActivityResult => {
                ActivityResult.find({s_rating : ActivityResult.s_rating}).then(RatingResult =>{
                    resolve(RatingResult)
                })
            }).catch(err => reject(err))
        })
    },
    groupByActivity() {
        return new Promise((resolve, reject) => {
            modelSurway.aggregate([{
                $group: {
                    _activity: "$s_activity",
                    total: { $sum: 1 }
                }
            }]).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    findAll(value){
        return new Promise((resolve, reject) => {
            const items = { result: [] }
            var query = {};
            if (value.search_key && value.search_text) {
                query[value.search_key] = { '$regex': value.search_text, '$options': 'i' }
            }
            
            modelSurway.find(query).sort({ 'u_id': -1 }).then(result => {
                //console.log(result);
                items.result = result
                modelSurway.find(query).countDocuments().then(count => {
                    items.rows = count
                    resolve(items)
                }).catch(err => reject(err))
                //resolve(res)
            }).catch(err => reject(err))
        })
    },
    findByActivity(value) {
        return new Promise((resolve, reject) => {
            //console.log(value.s_activity)
            modelSurway.find({ s_activity : value.s_activity }).then(result => {
                // console.log(result)
                if(result != null){
                    resolve({result:result})
                }else{
                    resolve({result: 0})
            }
        }).catch(err => reject(err))
    })
},
// ลบข้อมูล
onDelete(value) {
    console.log(value)
    return new Promise((resolve, reject) => {
        modelSurway.deleteOne({
            _id: value[0]._id
        }).then(result => {
            console.log(result)
            resolve(result)
        }).catch(err => reject(err))
    })
}  
}

const connection = require('../configs/database')
const modelReport = connection.model('report', {
    u_id: String,
    u_phone: String,
    u_email: String, 
    u_problem: String,
    u_comment: String,
    u_updated: Date
})
module.exports = {
    onInsert(value){
        return new Promise((resolve, reject) => {
            const newReport = new modelReport({ 
                u_id: value.u_id,
                u_phone: value.u_phone,
                u_email: value.u_email, 
                u_problem: value.u_problem,
                u_comment: value.u_comment,
                u_updated: Date.now()
            })
            // save to database (return as Promise)
            newReport.save().then(res => resolve({ status: 'inserted' })).catch(err => reject({ status: 'cannot inserted' }))
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

            modelReport.find(query).skip(startPage).sort({ 'u_updated': -1 }).limit(limitPage).then(result => {
                items.result = result
                modelReport.find(query).countDocuments().then(count => {
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
            modelReport.find(query).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    onDelete(value) {
        console.log(value)
        return new Promise((resolve, reject) => {
            modelReport.deleteOne({
                _id: value[0]._id
            }).then(result => {
                console.log(result)
                resolve(result)
            }).catch(err => reject(err))
        })
    }

}

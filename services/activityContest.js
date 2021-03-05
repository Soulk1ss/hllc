const connection = require('../configs/database')
const modelActivityContest = connection.model('ActivityContest', {
    acv_u_id: String,
    ac_id: String,
    ac_url: String,
    u_name: String,
    u_school: String,
    acv_data: Date
})
module.exports = modelActivityContest
module.exports = {
    // โหวต
    onVote(value) {
        return new Promise((resolve, reject) => {
            const newACV = new modelActivityContest({
                acv_u_id: value.acv_u_id,
                ac_id: value.ac_id,
                ac_url: value.ac_url,
                u_name: value.u_name,
                u_school: value.u_school,
                acv_data: Date.now()
            })
            newACV.save().then(res => resolve(newACV)).catch(err => reject(err))
            // .then(res => this.VoteRanking())
        })
    },
    groupByClipID() {
        return new Promise((resolve, reject) => {
            modelActivityContest.aggregate([{
                $group: {
                    _id: "$ac_id",
                    total: { $sum: 1 }
                }
            }]).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    findByUID(id) {
        return new Promise((resolve, reject) => {
            const items = { result: [], voteNum: 0 }
            var query = {};
            query['acv_u_id'] = id
            modelActivityContest.find(query).countDocuments().then(result => {
                items.voteNum = result
                modelActivityContest.find(query).then(resultData => {
                    items.result = resultData
                    resolve(items)
                })
            }).catch(err => reject(err))
        })
    },
}
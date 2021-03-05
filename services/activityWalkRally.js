const connection = require('../configs/database')
const modelActivityWalkRally = connection.model('ActivityWalkRally', {
    u_id: String,
    u_username: String,
    aw_updated: Date
})
module.exports = {
    onInsert(value) {
        return new Promise((resolve, reject) => {
            const newWR = new modelActivityWalkRally({
                u_id: value.u_id,
                u_username: value.u_username,
                aw_updated: Date.now()
            })
            newWR.save().then(res => resolve(newWR)).catch(err => reject(err))
        })
    },
    findOne(value) {
        return new Promise((resolve, reject) => {
            modelActivityWalkRally.find({ u_id: value.id }).then(result => {
                resolve(result[0])
            }).catch(err => reject(err))
        })
    }
}
const connection = require('../configs/database')
const modelActivitySchool = connection.model('ActivitySchool', {
    u_id: String,
    asch_updated: Date
})
// ค้นหาจากรหัสนักศึกษา
module.exports = {
    findOne(id) {
        return new Promise((resolve, reject) => {
            modelActivitySchool.find({ u_id: id }).then(result => {
                resolve(result[0])
            }).catch(err => reject(err))
        })
    },
    onInsert(value) {
        return new Promise((resolve, reject) => {
            const newSch = new modelActivitySchool({
                u_id: value.u_id,
                asch_updated: Date.now()
            })
            newSch.save().then(res => resolve(newSch)).catch(err => reject(err))
        })
    }
}
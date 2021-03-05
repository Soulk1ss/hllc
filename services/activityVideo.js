const connection = require('../configs/database')
const modelActivityVideo = connection.model('ActivityVideo', {
    u_id: String,
    u_username: String,
    av_name: String,
    av_updated: Date
})
// ค้นหาจากรหัสนักศึกษา
module.exports = {
    findOne(value) {
        return new Promise((resolve, reject) => {
            /*
            modelActivityVideo.find({ u_id: value.id }).then(result => {
                resolve(result[0])
            }).catch(err => reject(err))*/
            var query = {};
            query['u_id'] = value.id
            if (value.av_name) {
                query['av_name'] = { '$regex': value.av_name, '$options': 'i' }
            }
            modelActivityVideo.find(query).then(result => {
                resolve(result[0])
            }).catch(err => reject(err))
        })

    },
    onInsert(value) {
        return new Promise((resolve, reject) => {
            //if (value.av_name != "Teen Lesson") {
                const newAV = new modelActivityVideo({
                    u_id: value.u_id,
                    u_username: value.u_username,
                    av_name: value.av_name,
                    av_updated: Date.now()
                })
                newAV.save().then(res => resolve(newAV)).catch(err => reject(err))
            //}

        })
    },
    onUpdate(value) {
        return new Promise((resolve, reject) => {
            var conditions = { u_id: value.u_id }
                , update = {
                    av_updated: Date.now()
                }
                , options = { multi: true };
            modelActivityVideo.updateOne(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    }
}

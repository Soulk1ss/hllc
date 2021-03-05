const connection = require('../configs/database')
const modelControllerLiveStream = connection.model('ControllerLiveStream', {
    admin_als_pyt_id: String,
    admin_als_yt_link: String,
    admin_als_enable_done: Boolean,
    admin_als_enable_link: Boolean,
    admin_als_updated: Date
})
module.exports = {
    // เพิ่มข้อมูล
    onInsert(value) {
        return new Promise((resolve, reject) => {
            const newALS = new modelControllerLiveStream({
                admin_als_pyt_id: value.admin_als_pyt_id,
                admin_als_yt_link: value.admin_als_yt_link,
                admin_als_enable_done: value.admin_als_enable_done,
                admin_als_enable_link: value.admin_als_enable_link,
                admin_als_updated: Date.now()
            })
            newALS.save().then(res => resolve(newALS)).catch(err => reject(err))
        })
    },
    // แก้ไขข้อมูล
    onUpdate(value) {
        return new Promise((resolve, reject) => {
            var conditions = {}
                , update = {
                    admin_als_pyt_id: value.admin_als_pyt_id,
                    admin_als_yt_link: value.admin_als_yt_link,
                    admin_als_enable_done: value.admin_als_enable_done,
                    admin_als_enable_link: value.admin_als_enable_link,
                    admin_als_updated: Date.now()
                }
                , options = { multi: true };
            modelControllerLiveStream.update(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    // ค้นหาข้อมูล
    find() {
        return new Promise((resolve, reject) => {
            modelControllerLiveStream.find().then(result => {
                resolve(result[0])
            }).catch(err => reject(err))
        })
    },
}
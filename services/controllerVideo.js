const connection = require('../configs/database')
const modelControllerVideo = connection.model('ControllerVideo', {
    admin_av_name: String,
    admin_av_enable: Boolean,
    admin_av_disable_msg: String,
    admin_av_hide_controller: Boolean,
    admin_av_yt_id: String,
    admin_av_autoplay: Boolean,
    admin_av_hide_controller: Boolean,
    admin_av_updated: Date
})
module.exports = {
    // เพิ่มข้อมูล
    onInsert(value) {
        return new Promise((resolve, reject) => {
            const newAV = new modelControllerVideo({
                admin_av_name: value.admin_av_name,
                admin_av_enable: value.admin_av_enable,
                admin_av_disable_msg: value.admin_av_disable_msg,
                admin_av_hide_controller: value.admin_av_hide_controller,
                admin_av_yt_id: value.admin_av_yt_id,
                admin_av_autoplay: value.admin_av_autoplay,
                admin_av_updated: Date.now()
            })
            newAV.save().then(res => resolve(newAV)).catch(err => reject(err))
        })
    },
    onUpdate(value) {
        return new Promise((resolve, reject) => {
            var conditions = { admin_av_name: value.admin_av_name }
                , update = {
                    admin_av_enable: value.admin_av_enable,
                    admin_av_disable_msg: value.admin_av_disable_msg,
                    admin_av_yt_id: value.admin_av_yt_id,
                    admin_av_hide_controller: value.admin_av_hide_controller,
                    admin_av_autoplay: value.admin_av_autoplay,
                    admin_av_updated: Date.now()
                }
                , options = { multi: true };
                modelControllerVideo.update(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    findOne(value) {
        return new Promise((resolve, reject) => {
            modelControllerVideo.find({ admin_av_name: value.admin_av_name }).then(result => {
                resolve(result[0])
            }).catch(err => reject(err))
        })
    }
}
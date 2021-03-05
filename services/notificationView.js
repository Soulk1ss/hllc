const connection = require('../configs/database')
const modelNotificationView = connection.model('notificationView', {
    u_id: String,
    no_id: connection.Schema.ObjectId,
    nov_updated: Date
})
module.exports = {
    onInsert(value) {
        return new Promise((resolve, reject) => {
            console.log(value)
            const newNotificationView = new modelNotificationView({
                u_id: value.u_id,
                no_id: value.no_id,
                nov_updated: Date.now()
            })
            // save to database (return as Promise)
            newNotificationView.save().then(res => resolve({ status: 'inserted' })).catch(err => reject({ status: 'cannot inserted' }))
        })
    }
}
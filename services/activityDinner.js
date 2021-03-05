const connection = require('../configs/database')
const limitCon = 20

module.exports = {
    getConversation() {
        /*
        const modelConversationGet = connection.model('ActivityDinnerConversation', {
            u_id: String,
            u_username: String,
            adc_text: String,
            adc_updated: Date
        })
        */
       modelConversation.find().sort({ 'adc_updated': -1 }).limit(limitCon).then(result => {
            resolve(result)
        }).catch(err => reject(err))
    }
}
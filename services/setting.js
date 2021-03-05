const connection = require('../configs/database')
const modelSetting = connection.model('Setting', {
    ac_contentcontest: Boolean,
    s_updated: Date
})

module.exports = {
    //เพิ่มถ้าไม่มี Object
    onStart(value) {
        return new Promise((resolve, reject) => {
            const newS = new modelSetting({
                ac_contentcontest : value.ac_contentcontest,
                s_updated: Date.now()
            })
            newS.save().then(res => resolve(newS)).catch(err => reject(err))
        })
    },
    // เปลี่ยนเปิด-ปิด content 
    onUpdate(value){
        return new Promise((resolve, reject) => {
          
            var conditions = {  _id : value._id }
                , update = {
                    ac_contentcontest : value.ac_contentcontest,
                    s_updated: Date.now()
                }, options = { multi: true };;
             
                modelSetting.update(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    find() {
        return new Promise((resolve, reject) => {
            modelSetting.find({}).then(result => {
                resolve(result[0])
            }).catch(err => reject(err))
        })
    },
    findOne(value) {
        return new Promise((resolve, reject) => {
            modelSetting.find({_id:value._id}).then(result => {
                resolve(result[0])
            }).catch(err => reject(err))
        })
    }



}
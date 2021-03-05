const connection = require('../configs/database')
const modelActivityFlower = connection.model('ActivityFlower', {
    u_id: String,
    u_username: String,
    af_description: String,
    af_image: String,
    af_updated: Date
})
module.exports = {
    // เพิ่มรูป
    onInsert(value) {
        return new Promise((resolve, reject) => {
            const newAF = new modelActivityFlower({
                u_id: value.u_id,
                u_username: value.u_username,
                af_description: value.af_description,
                af_image: value.af_image,
                af_updated: Date.now()
            })
            newAF.save().then(res => resolve(newAF)).catch(err => reject(err))
        })
    },
    // ค้นหาข้อมูลจากคำค้น
    find(value) {
        return new Promise((resolve, reject) => {
            const limitPage = 20
            const startPage = ((value.page || 1) - 1) * limitPage
            const items = { result: [], rows: 0, limit: limitPage }
            var query = {};
            if (value.search_key && value.search_text) {
                query[value.search_key] = { '$regex': value.search_text, '$options': 'i' }
            }
            modelActivityFlower.find(query).skip(startPage).sort({'af_updated': -1}).limit(limitPage).then(result => {
                items.result = result
                modelActivityFlower.find(query).countDocuments().then(count => {
                    items.rows = count
                    resolve(items)
                }).catch(err => reject(err))
                //resolve(res)
            }).catch(err => reject(err))
        })
    },
    // ค้นหาข้อมูลจากรหัสนักศึกษา
    findOne(value) {
        return new Promise((resolve, reject) => {
            modelActivityFlower.find({ u_id: value.id }).then(result => {
                resolve(result[0])
            }).catch(err => reject(err))
        })
    },
    // แก้ไขข้อมูลใหม่
    onUpdate(id, value) {
        return new Promise((resolve, reject) => {
            var conditions = { u_id: id }
                , update = { 
                    af_image: value.af_image, 
                    af_description: value.af_description, 
                    af_updated: Date.now()
                }
                , options = { multi: true };
            modelActivityFlower.updateOne(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    // ลบข้อมูล
    onDelete(id) {
        return new Promise((resolve, reject) => {
            modelActivityFlower.deleteOne({
                u_id: id
            }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    onDeleteByObjID(_id) {
        return new Promise((resolve, reject) => {
            modelActivityFlower.deleteOne({
                _id: _id
            }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    findOneByObjID(_id) {
        return new Promise((resolve, reject) => {
            modelActivityFlower.find({ _id: _id }).then(result => {
                resolve(result[0])
            }).catch(err => reject(err))
        })
    }
}
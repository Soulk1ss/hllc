const connection = require('../configs/database')
const modelActivityPainting = connection.model('ActivityPainting', {
    u_id: String,
    u_username: String,
    acp_image: String,
    acp_moto: String,
    acp_updated: Date
})
module.exports = {
    // เพิ่มรูป
    onInsert(value) {
        return new Promise((resolve, reject) => {
            const newACP = new modelActivityPainting({
                u_id: value.u_id,
                u_username: value.u_username,
                acp_image: value.acp_image,
                acp_moto: value.acp_moto,
                acp_updated: Date.now()
            })
            newACP.save().then(res => resolve(newACP)).catch(err => reject(err))
        })
    },
    // ค้นหาข้อมูล
    findOne(value) {
        return new Promise((resolve, reject) => {
            modelActivityPainting.find({ u_id: value.id }).then(result => {
                resolve(result[0])
            }).catch(err => reject(err))
        })
    },
    // แสดงข้อมูลตามหน้า
    find(value) {
        return new Promise((resolve, reject) => {
            const limitPage = 4
            const startPage = ((value.page || 1) - 1) * limitPage
            const items = { result: [], rows: 0, limit: limitPage }
            var query = {};
            if (value.search_key && value.search_text) {
                query[value.search_key] = { '$regex': value.search_text, '$options': 'i' }
            }
            //console.log(query)
            modelActivityPainting.find(query).skip(startPage).sort({ 'acp_updated': -1 }).limit(limitPage).then(result => {
                items.result = result
                modelActivityPainting.find(query).countDocuments().then(count => {
                    items.rows = count
                    resolve(items)
                }).catch(err => reject(err))
                //resolve(res)
            }).catch(err => reject(err))
        })
    },
    // แก้ไขข้อมูลรูปภาพ
    onUpdate(id, value) {
        return new Promise((resolve, reject) => {
            var conditions = { u_id: id }
                , update = {
                    acp_image: value.acp_image,
                    acp_moto: value.acp_moto,
                    acp_updated: Date.now()
                }
                , options = { multi: true };
            modelActivityPainting.updateOne(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
}
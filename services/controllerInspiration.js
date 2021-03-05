const connection = require('../configs/database')
const modelActivityinspiration = connection.model('ActivityInspiration', {
    ins_name:String,
    ins_description:String,
    ins_url:String,
    ins_school:String,
    ins_major:String,
    ins_updated:Date
})
module.exports = modelActivityinspiration
module.exports ={
    //เพิ่มวิดีโอ
    onInsert(value) {
        return new Promise((resolve, reject) => {
            const newAlu = new modelActivityinspiration({
                ins_id : value.id,
                ins_name:value.ins_name,
                ins_description:value.ins_description,
                ins_url : value.ins_url,
                ins_major:value.ins_major,
                ins_school : value.ins_school,
                ins_updated : Date.now()
            })
            newAlu.save().then(res => resolve(newAlu)).catch(err => reject(err))
        })
    },
    //ค้นหาข้อมูลจากสำนัก
    findOne(value) {
        return new Promise((resolve, reject) => {
            modelActivityinspiration.find({ ins_school : value.ins_school,ins_major : value.ins_major }).then(result => {
                resolve(result[0])
            }).catch(err => reject(err))
        })
    },
    findAll(value) {
        return new Promise((resolve, reject) => {
            modelActivityinspiration.find({ ins_school : value.ins_school }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    find(value) {
        return new Promise((resolve, reject) => {
            const limitPage = 12
            const startPage = ((value.page || 1) - 1) * limitPage
            const items = { result: [], rows: 0, limit: limitPage }
            var query = {};
            if (value.search_key && value.search_text) {
                query[value.search_key] = { '$regex': value.search_text, '$options': 'i' }
            }

            modelActivityinspiration.find(query).skip(startPage).sort({ 'aln_updated': -1 }).limit(limitPage).then(result => {
                items.result = result
                modelActivityinspiration.find(query).countDocuments().then(count => {
                    items.rows = count
                    resolve(items)
                }).catch(err => reject(err))
                //resolve(res)
            }).catch(err => reject(err))
        })
    },
    // แก้ไข
    onUpdate(value){
        return new Promise((resolve, reject) => {
            var conditions = {  ins_major : value.ins_major }
                , update = {
                    ins_name:value.ins_name,
                    ins_description:value.ins_description,
                    ins_url : value.ins_url,
                    ins_school : value.ins_school,
                    ins_major:value.ins_major,
                    ins_updated: Date.now()
                }
                , options = { multi: true };
                modelActivityinspiration.update(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },//ค้นหาข้อมูลจากสำนัก
    findOneBySchool(value) {
        return new Promise((resolve, reject) => {
            modelActivityinspiration.find({ ins_school : value.ins_school }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    //ค้นหาข้อมูลจากสาขา
    findOneBymajor(value) {
        //console.log(value)
        return new Promise((resolve, reject) => {
            modelActivityinspiration.findOne({ 
                ins_major : value.ins_major,
                ins_school : value.ins_school 
            }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    onDelete(id) {
        return new Promise((resolve, reject) => {
            modelActivityinspiration.deleteOne({
                _id: id
            }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
            
        })
    },
    findOneByID(id) {
        return new Promise((resolve, reject) => {
            modelActivityinspiration.findOne({ _id: id }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
}

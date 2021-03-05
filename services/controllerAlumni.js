const connection = require('../configs/database')
const modelActivityAlumni = connection.model('ActivityAlumni', {
    aln_name: String,
    aln_description: String,
    aln_url: String,
    aln_school: String,
    aln_major: String,
    aln_img: String,
    aln_updated: Date
})
module.exports = modelActivityAlumni
module.exports = {
    //เพิ่มวิดีโอ
    onInsert(value) {
        return new Promise((resolve, reject) => {
            const newAlu = new modelActivityAlumni({
                aln_id: value.id,
                aln_name: value.aln_name,
                aln_description: value.aln_description,
                aln_url: value.aln_url,
                aln_img: value.aln_img,
                aln_major: value.aln_major,
                aln_school: value.aln_school,
                aln_updated: Date.now()
            })
            newAlu.save().then(res => resolve(newAlu)).catch(err => reject(err))
        })
    },
    //ค้นหาข้อมูลจากสำนัก
    findOneBySchool(value) {
        return new Promise((resolve, reject) => {
            modelActivityAlumni.find({ aln_school: value.aln_school }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    //ค้นหาข้อมูลจากสาขา
    findOneBymajor(value) {
        return new Promise((resolve, reject) => {
            modelActivityAlumni.findOne({
                aln_major: value.aln_major,
                aln_school: value.aln_school
            }).lean().then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    onDelete(id) {
        return new Promise((resolve, reject) => {
            modelActivityAlumni.deleteOne({
                _id: id
            }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    findOneByID(id) {
        return new Promise((resolve, reject) => {
            modelActivityAlumni.findOne({ _id: id }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    findAll(value) {
        return new Promise((resolve, reject) => {
            modelActivityAlumni.find({}).then(result => {
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

            modelActivityAlumni.find(query).skip(startPage).sort({ 'aln_updated': -1 }).limit(limitPage).then(result => {
                items.result = result
                modelActivityAlumni.find(query).countDocuments().then(count => {
                    items.rows = count
                    resolve(items)
                }).catch(err => reject(err))
            }).catch(err => reject(err))
        })
    },
    // แก้ไข
    onUpdate(value) {
        return new Promise((resolve, reject) => {
            var conditions = { aln_major: value.aln_major }
                , update = {
                    aln_name: value.aln_name,
                    aln_description: value.aln_description,
                    aln_url: value.aln_url,
                    aln_img: value.aln_img,
                    aln_school: value.aln_school,
                    aln_major: value.aln_major,
                    aln_updated: Date.now()
                }
                , options = { multi: true };
            modelActivityAlumni.updateOne(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
}

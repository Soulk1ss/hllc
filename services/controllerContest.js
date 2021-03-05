const connection = require('../configs/database')
const activityContest = require('./activityContest');
const modelActivityContest = activityContest.modelActivityContest
const modelControllerContest = connection.model('ControllerContest', {
    u_id: String,
    ac_url: String,
    ac_name: String,
    ac_description: String,
    ac_vote: Boolean,
    ac_updated: Date,
    ac_order: String

})
module.exports = modelControllerContest
module.exports = {
    // เพิ่มวิดีโอ
    onInsert(value) {
        return new Promise((resolve, reject) => {
            const newAC = new modelControllerContest({
                u_id: value.u_id,
                //ac_type: value.ac_type,
                ac_url: value.ac_url,
                ac_name: value.ac_name,
                ac_description: value.ac_description,
                ac_vote: value.ac_vote,
                ac_updated: Date.now(),
            })
            newAC.save().then(res => resolve(newAC)).catch(err => reject(err))
        })
    },
    // สลับตำแหน่ง
    shuffle() {
        return new Promise((resolve, reject) => {
            modelControllerContest.find().countDocuments().then(count => {
                resolve(count)
                let nums = [],
                    ranNums = [],
                    j = 0;
                //เก็บอันดับเพื่อจัดเรียงใหม่
                for (var i = 0; i < count; i++) {
                    nums.push(i);
                }
                let k = nums.length;

                while (k--) {
                    j = Math.floor(Math.random() * (k + 1));
                    ranNums.push(nums[j]);
                    nums.splice(j, 1);
                }
                modelControllerContest.find().then(result => {
                    result.forEach((item, index) => {
                        modelControllerContest.updateOne(
                            { u_id: item.u_id },
                            { ac_order: ranNums[index] },
                            { multi: true }
                        ).exec(function (err, res) {
                            if (err) {
                                reject(err)
                            }
                        });
                    })
                    resolve(result)
                }).catch(err => reject(err))
            }).catch(err => reject(err))
        });
    },
    onOrder(value) {
        return new Promise((resolve, reject) => {
            var conditions = { u_id: value.u_id }
                , update = {
                    ac_order: value.ac_order,
                }
                , options = { multi: true };
            modelControllerContest.update(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    // // ค้นหาข้อมูลจากรหัสนักศึกษา
    findOne(value) {
        return new Promise((resolve, reject) => {
            modelControllerContest.find({ u_id: value.id }).then(result => {
                resolve(result[0])
            }).catch(err => reject(err))
        })
    },
    //ค้นหาทุกวิดีโอ
    findAll(value) {
        return new Promise((resolve, reject) => {
            const items = { result: [] }
            var query = {};
            if (value.search_key && value.search_text) {
                query[value.search_key] = { '$regex': value.search_text, '$options': 'i' }
            }

            modelControllerContest.find(query).sort({ 'u_id': -1 }).then(result => {

                items.result = result
                modelControllerContest.find(query).countDocuments().then(count => {
                    items.rows = count
                    resolve(items)
                }).catch(err => reject(err))
                //resolve(res)
            }).catch(err => reject(err))
        })
    },
    // ค้นหาวิดีโอเรียงตามผลโหวตแยกหน้า
    findByVote(value) {
        return new Promise((resolve, reject) => {
            const limitPage = 12
            const startPage = ((value.page || 1) - 1) * limitPage
            const items = { result: [], rows: 0, limit: limitPage }
            var query = {};
            var sort = -1;

            if (value.sort == "asc") {
                sort = 1;
            } else if (value.sort == "desc") {
                sort = -1;
            }
            if (value.search_key && value.search_text) {
                query[value.search_key] = { '$regex': value.search_text, '$options': 'i' }
            }
            modelControllerContest.aggregate([
                {
                    $lookup: {
                        from: "activitycontests", // collection name in db
                        localField: "u_id",
                        foreignField: "ac_id",
                        as: "acv"
                    }
                },
                { $match: query },
                {
                    $project: {
                        "u_id": 1,
                        "ac_url": 1,
                        "ac_name": 1,
                        "ac_description": 1,
                        "ac_vote": 1,
                        "ac_updated": 1,
                        "acv": { $size: "$acv" }
                    }
                },
                {
                    $sort: {
                        "acv": sort
                    }
                }
            ]).skip(startPage).limit(limitPage).then(result => {

                items.result = result
                modelControllerContest.find(query).countDocuments().then(count => {
                    items.rows = count
                    resolve(items)
                }).catch(err => reject(err))
            }).catch(err => reject(err));
        })
    },
    // ค้นหาวิดีโอเรียงตามผลOrderแยกหน้า
    findByOrder(value) {

        return new Promise((resolve, reject) => {
            const limitPage = 12
            const startPage = ((value.page || 1) - 1) * limitPage
            const items = { result: [], rows: 0, limit: limitPage }
            var query = {};
            if (value.search_key && value.search_text) {
                query[value.search_key] = { '$regex': value.search_text, '$options': 'i' }
            }

            modelControllerContest.find(query).skip(startPage).sort({ 'ac_order': -1 }).limit(limitPage).then(result => {

                items.result = result
                modelControllerContest.find(query).countDocuments().then(count => {
                    items.rows = count
                    resolve(items)
                }).catch(err => reject(err))
                //resolve(res)
            }).catch(err => reject(err))
        })
    },
    // เปิดให้ video มีการโหวต
    onEnableVideoVote(value) {
        return new Promise((resolve, reject) => {
            var conditions = { u_id: id }
                , update = {
                    ac_vote: value.ac_vote
                }
                , options = { multi: true };
            modelControllerContest.update(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    // ลบข้อมูล
    onDelete(id) {
        return new Promise((resolve, reject) => {
            modelControllerContest.deleteOne({
                u_id: id
            }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    }

}
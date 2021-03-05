"use strict";

var connection = require('../configs/database');

var activityContest = require('./activityContest');

var modelActivityContest = activityContest.modelActivityContest;
var modelControllerContest = connection.model('ControllerContest', {
  u_id: String,
  ac_url: String,
  ac_name: String,
  ac_description: String,
  ac_vote: Boolean,
  ac_updated: Date,
  ac_order: String
});
module.exports = modelControllerContest;
module.exports = {
  // เพิ่มวิดีโอ
  onInsert: function onInsert(value) {
    return new Promise(function (resolve, reject) {
      var newAC = new modelControllerContest({
        u_id: value.u_id,
        //ac_type: value.ac_type,
        ac_url: value.ac_url,
        ac_name: value.ac_name,
        ac_description: value.ac_description,
        ac_vote: value.ac_vote,
        ac_updated: Date.now()
      });
      newAC.save().then(function (res) {
        return resolve(newAC);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  // สลับตำแหน่ง
  shuffle: function shuffle() {
    return new Promise(function (resolve, reject) {
      modelControllerContest.find().countDocuments().then(function (count) {
        var nums = [],
            ranNums = [],
            j = 0; //เก็บอันดับเพื่อจัดเรียงใหม่

        for (var i = 0; i < count; i++) {
          nums.push(i);
        }

        var k = nums.length;

        while (k--) {
          j = Math.floor(Math.random() * (k + 1));
          ranNums.push(nums[j]);
          nums.splice(j, 1);
        }

        modelControllerContest.find().then(function (result) {
          result.forEach(function (item, index) {
            console.log(item.u_id + " = " + ranNums[index]);
            modelControllerContest.update({
              u_id: item.u_id
            }, {
              ac_order: ranNums[index]
            }, {
              multi: true
            }).then(function (res) {})["catch"](function (err) {
              return reject(err);
            });
          });
          resolve(result);
        })["catch"](function (err) {
          return reject(err);
        }); //console.log(ranNums);

        resolve(ranNums);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  onOrder: function onOrder(value) {
    return new Promise(function (resolve, reject) {
      var conditions = {
        u_id: value.u_id
      },
          update = {
        ac_order: value.ac_order
      },
          options = {
        multi: true
      };
      modelControllerContest.update(conditions, update, options).then(function (result) {
        resolve(result);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  // // ค้นหาข้อมูลจากรหัสนักศึกษา
  findOne: function findOne(value) {
    return new Promise(function (resolve, reject) {
      modelControllerContest.find({
        u_id: value.id
      }).then(function (result) {
        resolve(result[0]);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  //ค้นหาทุกวิดีโอ
  findAll: function findAll(value) {
    return new Promise(function (resolve, reject) {
      var items = {
        result: []
      };
      var query = {};

      if (value.search_key && value.search_text) {
        query[value.search_key] = {
          '$regex': value.search_text,
          '$options': 'i'
        };
      }

      modelControllerContest.find(query).sort({
        'u_id': -1
      }).then(function (result) {
     
        items.result = result;
        modelControllerContest.find(query).countDocuments().then(function (count) {
          items.rows = count;
          resolve(items);
        })["catch"](function (err) {
          return reject(err);
        }); //resolve(res)
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  // ค้นหาวิดีโอเรียงตามผลโหวตแยกหน้า
  findByVote: function findByVote(value) {
    return new Promise(function (resolve, reject) {
      var limitPage = 12;
      var startPage = ((value.page || 1) - 1) * limitPage;
      var items = {
        result: [],
        rows: 0,
        limit: limitPage
      };
      var query = {};
      var sort = -1;

      if (value.sort == "asc") {
        sort = 1;
      } else if (value.sort == "desc") {
        sort = -1;
      }

      if (value.search_key && value.search_text) {
        query[value.search_key] = {
          '$regex': value.search_text,
          '$options': 'i'
        };
      }

      modelControllerContest.aggregate([{
        $lookup: {
          from: "activitycontests",
          // collection name in db
          localField: "u_id",
          foreignField: "ac_id",
          as: "acv"
        }
      }, {
        $match: query
      }, {
        $project: {
          "u_id": 1,
          "ac_url": 1,
          "ac_name": 1,
          "ac_description": 1,
          "ac_vote": 1,
          "ac_updated": 1,
          "acv": {
            $size: "$acv"
          }
        }
      }, {
        $sort: {
          "acv": sort
        }
      }]).skip(startPage).limit(limitPage).then(function (result) {
        items.result = result;
        modelControllerContest.find(query).countDocuments().then(function (count) {
          items.rows = count;
          resolve(items);
        })["catch"](function (err) {
          return reject(err);
        });
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  // ค้นหาวิดีโอเรียงตามผลOrderแยกหน้า
  findByOrder: function findByOrder(value) {
    return new Promise(function (resolve, reject) {
      var limitPage = 12;
      var startPage = ((value.page || 1) - 1) * limitPage;
      var items = {
        result: [],
        rows: 0,
        limit: limitPage
      };
      var query = {};

      if (value.search_key && value.search_text) {
        query[value.search_key] = {
          '$regex': value.search_text,
          '$options': 'i'
        };
      }

      modelControllerContest.find(query).skip(startPage).sort({
        'ac_order': -1
      }).limit(limitPage).then(function (result) {
       
        items.result = result;
        modelControllerContest.find(query).countDocuments().then(function (count) {
          items.rows = count;
          resolve(items);
        })["catch"](function (err) {
          return reject(err);
        }); //resolve(res)
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  // เปิดให้ video มีการโหวต
  onEnableVideoVote: function onEnableVideoVote(value) {
    return new Promise(function (resolve, reject) {
      var conditions = {
        u_id: id
      },
          update = {
        ac_vote: value.ac_vote
      },
          options = {
        multi: true
      };
      modelControllerContest.update(conditions, update, options).then(function (result) {
        resolve(result);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  // ลบข้อมูล
  onDelete: function onDelete(id) {
    return new Promise(function (resolve, reject) {
      modelControllerContest.deleteOne({
        u_id: id
      }).then(function (result) {
        resolve(result);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  }
};
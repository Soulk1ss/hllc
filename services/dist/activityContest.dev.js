"use strict";

var connection = require('../configs/database');

var modelActivityContest = connection.model('ActivityContest', {
  acv_u_id: String,
  ac_id: String,
  ac_url: String,
  u_name: String,
  u_school: String,
  acv_data: Date
});
module.exports = modelActivityContest;
module.exports = {
  // โหวต
  onVote: function onVote(value) {
    return new Promise(function (resolve, reject) {
      var newACV = new modelActivityContest({
        acv_u_id: value.acv_u_id,
        ac_id: value.ac_id,
        ac_url: value.ac_url,
        u_name: value.u_name,
        u_school: value.u_school,
        acv_data: Date.now()
      });
      newACV.save().then(function (res) {
        return resolve(newACV);
      })["catch"](function (err) {
        return reject(err);
      }); // .then(res => this.VoteRanking())
    });
  },
  groupByClipID: function groupByClipID() {
    return new Promise(function (resolve, reject) {
      modelActivityContest.aggregate([{
        $group: {
          _id: "$ac_id",
          total: {
            $sum: 1
          }
        }
      }]).then(function (result) {
        resolve(result);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  findByUID: function findByUID(id) {
    return new Promise(function (resolve, reject) {
      var items = {
        result: [],
        voteNum: 0
      };
      var query = {};
      query['acv_u_id'] = id;
      modelActivityContest.find(query).countDocuments().then(function (result) {
        items.voteNum = result;
        modelActivityContest.find(query).then(function (resultData) {
          items.result = resultData;
          resolve(items);
        });
      })["catch"](function (err) {
        return reject(err);
      });
    });
  }
};
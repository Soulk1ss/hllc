"use strict";

var connection = require('../configs/database');

var _require = require('../configs/security'),
    password_hash = _require.password_hash,
    password_verify = _require.password_verify,
    isEmpty = _require.isEmpty;

var serviceVideo = require('../services/activityVideo');

var activityContest = require('../services/activityContest');

var modelActivityContest = activityContest.modelActivityContest;
var modelUser = connection.model('User', {
  u_id: String,
  u_password: String,
  u_username: String,
  u_lastname: String,
  u_nickname: String,
  u_school: String,
  u_major: String,
  u_blood: String,
  u_religion: String,
  u_thumbnail: String
});
module.exports = {
  onRegister: function onRegister(value) {
    return new Promise(function (resolve, reject) {
      value.u_password = password_hash(value.u_password); // create instance from user

      var newUser = new modelUser({
        u_id: value.u_id,
        u_username: value.u_username,
        u_password: value.u_password,
        u_faculty: value.u_faculty
      }); // save to database (return as Promise)

      newUser.save().then(function (res) {
        return resolve({
          status: 'registered'
        });
      })["catch"](function (err) {
        return reject({
          status: 'cannot registered'
        });
      });
    });
  },
  onGroupActivity: function onGroupActivity() {
    return new Promise(function (resolve, reject) {
      modelUser.find().countDocuments().then(function (res) {
        resolve(res);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  onSummary: function onSummary() {
    return new Promise(function (resolve, reject) {
      modelUser.aggregate([{
        $lookup: {
          from: "activitycontests",
          // collection name in db
          localField: "u_id",
          foreignField: "acv_u_id",
          as: "acv"
        }
      }, {
        $unwind: {
          path: '$acv',
          preserveNullAndEmptyArrays: true
        }
      }, {
        $lookup: {
          from: "activitypaintings",
          // collection name in db
          localField: "u_id",
          foreignField: "u_id",
          as: "acp"
        }
      }, {
        $unwind: {
          path: '$acp',
          preserveNullAndEmptyArrays: true
        }
      }, {
        $lookup: {
          from: "activityflowers",
          // collection name in db
          localField: "u_id",
          foreignField: "u_id",
          as: "af"
        }
      }, {
        $unwind: {
          path: '$af',
          preserveNullAndEmptyArrays: true
        }
      }, {
        $lookup: {
          from: "activitywalkrallies",
          // collection name in db
          localField: "u_id",
          foreignField: "u_id",
          as: "aw"
        }
      }, {
        $unwind: {
          path: '$aw',
          preserveNullAndEmptyArrays: true
        }
      }, {
        $lookup: {
          from: "activityvideos",
          // collection name in db
          localField: "u_id",
          foreignField: "u_id",
          as: "av"
        }
      }, {
        $unwind: {
          path: '$av',
          preserveNullAndEmptyArrays: true
        }
      }, {
        $group: {
          _id: "$_id",
          u_id: {
            "$first": "$u_id"
          },
          acp: {
            "$first": "$acp._id"
          },
          af: {
            "$first": "$af._id"
          },
          aw: {
            "$first": "$aw._id"
          },
          acv: {
            "$first": "$acv._id"
          },
          av: {
            $push: "$av"
          }
        }
      }, {
        $project: {
          "u_id": 1,
          "activity": [{
            id: "activity1",
            name: "Follow The Path",
            done: {
              $cond: {
                "if": {
                  $in: ["Follow The Path", "$av.av_name"]
                },
                then: 1,
                "else": 0
              }
            }
          }, {
            id: "activity2",
            name: "Lamduan Flower",
            //done: "$af"
            done: {
              $cond: {
                "if": {
                  $ne: ["$af", null]
                },
                then: 1,
                "else": 0
              }
            }
          }, {
            id: "activity3",
            name: "Walk Rally",
            //done: "$af"
            done: {
              $cond: {
                "if": {
                  $ne: ["$aw", null]
                },
                then: 1,
                "else": 0
              }
            }
          }, {
            id: "activity4",
            name: "Khantok",
            done: {
              $cond: {
                "if": {
                  $in: ["Khantok", "$av.av_name"]
                },
                then: 1,
                "else": 0
              }
            }
          }, {
            id: "activity5",
            name: "Set Your Goal",
            done: {
              $cond: {
                "if": {
                  $in: ["Set Your Goal", "$av.av_name"]
                },
                then: 1,
                "else": 0
              }
            }
          }, {
            id: "activity6",
            name: "Smart Learner",
            done: {
              $cond: {
                "if": {
                  $in: ["Smart Learner", "$av.av_name"]
                },
                then: 1,
                "else": 0
              }
            }
          }, {
            id: "activity7",
            name: "Teen Lesson",
            done: {
              $cond: {
                "if": {
                  $in: ["Teen Lesson", "$av.av_name"]
                },
                then: 1,
                "else": 0
              }
            }
          }, {
            id: "activity9",
            name: "Inspiration",
            done: {
              $cond: {
                "if": {
                  $in: ["Inspiration", "$av.av_name"]
                },
                then: 1,
                "else": 0
              }
            }
          }, {
            id: "activity10",
            name: "Painting",
            done: {
              $cond: {
                "if": {
                  $ne: ["$acp", null]
                },
                then: 1,
                "else": 0
              }
            }
          }, {
            id: "activity12",
            name: "Content Contest",
            done: {
              $cond: {
                "if": {
                  $ne: ["$acv", null]
                },
                then: 1,
                "else": 0
              }
            }
          }]
        }
      }, {
        $sort: {
          _id: 1
        }
      }]).then(function (res) {
        resolve(res);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  getAllStudent: function getAllStudent() {
    return new Promise(function (resolve, reject) {
      modelUser.find().then(function (res) {
        resolve(res);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  onUpdate: function onUpdate(value) {
    return new Promise(function (resolve, reject) {
      var conditions = {
        u_id: value.id
      },
          update = {
        u_thumbnail: value.thumbnail
      },
          options = {
        multi: true
      };
      modelUser.update(conditions, update, options).then(function (result) {
        resolve(result);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  onLogin: function onLogin(value) {
    return new Promise(function (resolve, reject) {
      //modelUser.find({ u_username: value.u_username, u_password: password_hash(value.u_password) }).select('u_username').then(res => resolve(res)).catch(err => reject(err))
      modelUser.find({
        u_id: value.u_id,
        u_password: value.u_password
      }).select('-u_password').then(function (res) {
        if (isEmpty(res)) {
          resolve({
            message: 'Authen fail'
          });
        } else {
          resolve(res[0]);
        }
      })["catch"](function (err) {
        return reject(err);
      });
    });
  }
};
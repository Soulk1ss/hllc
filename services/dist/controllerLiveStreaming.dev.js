"use strict";

var connection = require('../configs/database');

var modelControllerLiveStream = connection.model('ControllerLiveStream', {
  admin_als_pyt_id: String,
  admin_als_yt_link: String,
  admin_als_enable_done: Boolean,
  admin_als_enable_link: Boolean,
  admin_als_updated: Date
});
module.exports = {
  // เพิ่มข้อมูล
  onInsert: function onInsert(value) {
    return new Promise(function (resolve, reject) {
      var newALS = new modelControllerLiveStream({
        admin_als_pyt_id: value.admin_als_pyt_id,
        admin_als_yt_link: value.admin_als_yt_link,
        admin_als_enable_done: value.admin_als_enable_done,
        admin_als_enable_link: value.admin_als_enable_link,
        admin_als_updated: Date.now()
      });
      newALS.save().then(function (res) {
        return resolve(newALS);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  // แก้ไขข้อมูล
  onUpdate: function onUpdate(value) {
    return new Promise(function (resolve, reject) {
      var conditions = {},
          update = {
        admin_als_pyt_id: value.admin_als_pyt_id,
        admin_als_yt_link: value.admin_als_yt_link,
        admin_als_enable_done: value.admin_als_enable_done,
        admin_als_enable_link: value.admin_als_enable_link,
        admin_als_updated: Date.now()
      },
          options = {
        multi: true
      };
      modelControllerLiveStream.update(conditions, update, options).then(function (result) {
        resolve(result);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  // ค้นหาข้อมูล
  find: function find() {
    return new Promise(function (resolve, reject) {
      modelControllerLiveStream.find().then(function (result) {
        resolve(result[0]);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  }
};
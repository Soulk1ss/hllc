"use strict";

var connection = require('../configs/database');

var modelActivityFlower = connection.model('ActivityFlower', {
  u_id: String,
  u_username: String,
  af_description: String,
  af_image: String,
  af_updated: Date
});
module.exports = {
  // เพิ่มรูป
  onInsert: function onInsert(value) {
    return new Promise(function (resolve, reject) {
      var newAF = new modelActivityFlower({
        u_id: value.u_id,
        u_username: value.u_username,
        af_description: value.af_description,
        af_image: value.af_image,
        af_updated: Date.now()
      });
      newAF.save().then(function (res) {
        return resolve(newAF);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  // ค้นหาข้อมูลจากคำค้น
  find: function find(value) {
    return new Promise(function (resolve, reject) {
      var limitPage = 20;
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

      modelActivityFlower.find(query).skip(startPage).sort({
        'af_updated': -1
      }).limit(limitPage).then(function (result) {
        items.result = result;
        modelActivityFlower.find(query).countDocuments().then(function (count) {
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
  // ค้นหาข้อมูลจากรหัสนักศึกษา
  findOne: function findOne(value) {
    return new Promise(function (resolve, reject) {
      modelActivityFlower.find({
        u_id: value.id
      }).then(function (result) {
        resolve(result[0]);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  // แก้ไขข้อมูลใหม่
  onUpdate: function onUpdate(id, value) {
    return new Promise(function (resolve, reject) {
      var conditions = {
        u_id: id
      },
          update = {
        af_image: value.af_image,
        af_description: value.af_description,
        af_updated: Date.now()
      },
          options = {
        multi: true
      };
      modelActivityFlower.update(conditions, update, options).then(function (result) {
        resolve(result);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  },
  // ลบข้อมูล
  onDelete: function onDelete(id) {
    return new Promise(function (resolve, reject) {
      modelActivityFlower.deleteOne({
        u_id: id
      }).then(function (result) {
        resolve(result);
      })["catch"](function (err) {
        return reject(err);
      });
    });
  }
};
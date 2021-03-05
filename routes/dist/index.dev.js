"use strict";

var router = require('express').Router();

var account = require('./account');

var admin = require('./admin');

var activityFlower = require('./activityFlower');

var activityVideo = require('./activityVideo');

var activityContest = require('./activityContest');

var activityDinner = require('./activityDinner');

var activityPainting = require('./activityPainting');

var activityWalkRally = require('./activityWalkRally');

var activitySchool = require('./activitySchool');

var controllerVideo = require('./controllerVideo');

var controllerContest = require('./controllerContest');

var controllerInspiration = require('./controllerInspiration');

var controllerAlumni = require('./controllerAlumni');

var setting = require('./setting');

var notification = require('./notification');

var notificationView = require('./notificationView');

var controllerLiveStreaming = require('./controllerLiveStreaming');

var getUser = require('./userData');

var surway = require('./surway');

var report = require('./report');

var _require = require('../configs/security'),
    authenticated = _require.authenticated,
    authenticatedAdmin = _require.authenticatedAdmin; // หน้า login


router.use('/account', account);
router.use('/admin', admin); // Activity

router.use('/activityFlower', activityFlower);
router.use('/activityDinner', authenticated, activityDinner);
router.use('/activityPainting', authenticated, activityPainting);
router.use('/activityWalkRally', authenticated, activityWalkRally);
router.use('/activityContest', activityContest);
router.use('/activityVideo', authenticated, activityVideo);
router.use('/activitySchool', authenticated, activitySchool); // Controller

router.use('/controllerVideo', controllerVideo);
router.use('/controllerContest', controllerContest);
router.use('/controllerAlumni', controllerAlumni);
router.use('/controllerInspiration', controllerInspiration);
router.use('/controllerLiveStreaming', controllerLiveStreaming);
router.use('/setting', setting);
router.use('/notification', notification);
router.use('/notificationView', notificationView); // Surway

router.use('/surway', surway);
router.use('/report', report);
router.use('/getuser', getUser);
module.exports = router;
const express = require('express'),
    router = express.Router(),
    token = require('../middleware/token'),
    logisticToken = require('../middleware/logisticToken'),
    userModel = require('../models/userModel'),
    notificationModel = require('../models/notificationModel');

router.get('/getNotification', token, function (req, res, next) {
    notificationModel.find({ "userId": req.body.traderEmail }, function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            notificationModel.countDocuments({ "userId": req.body.traderEmail, 'notificationState': false }, function (err, docs) {
                if (err) {
                    res.status(400).send('could not find count')
                }
                res.status(200).json({
                    allNotifications: doc,
                    unreadCount: docs
                })
            });
        }
    })
})

router.get('/getNotificationLogistics', logisticToken, function (req, res, next) {
    notificationModel.find({ "userId": req.body.logisticsEmail }, function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            notificationModel.countDocuments({ "userId": req.body.logisticsEmail, 'notificationState': false }, function (err, docs) {
                if (err) {
                    res.status(400).send('could not find count')
                }
                res.status(200).json({
                    allNotifications: doc,
                    unreadCount: docs
                })
            });
        }
    })
})

// router.get('/newNotifications',token,(req,res)=>{
//   let userMail = req.body.traderEmail;
//   notificationModel.find({'userId':userMail,notificationState:false}).exec()
//   .then(resp=>{
//     res.status(200).send(resp);
//   }).catch(err=>{
//     res.status(404).send({ message: "error" })
//   })
// })

router.post('/getPermissions', token, function (req, res, next) {
    userModel.find({ "admin": req.body.adminStatus, 'traderId': req.body.traderId }, function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    })
})

router.get('/getModulePermissions', token, function (req, res, next) {
    userModel.find({ '_id': req.body.userId }, function (err, doc) {
        if (err) {
            res.status(404).send({ message: "error" })
        }
        else {
            res.status(200).send(doc);
        }
    })
})

module.exports = router;

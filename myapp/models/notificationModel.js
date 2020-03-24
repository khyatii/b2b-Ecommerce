var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var notification = mongoose.Schema({
    userId : { type: String},
    SenderId : {type: String},
    redirectUrl : { type:String,default:null },
    message : { type: String, default:null },
    notificationState : { type : Boolean, default : false },
    createdAt : { type:Date, default:Date.now()},
    updatedAt : { type:Date, default:Date.now()},
},{collection:'notification'})

module.exports = mongoose.model('notificationModel', notification);

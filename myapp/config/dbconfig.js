var mongoose = require('mongoose');
var constants = require('../config/url'); 
console.log("constants se db",constants.dbUrl)
var dbUrl = constants.dbUrl


mongoose.connect(`${dbUrl}`,{ useNewUrlParser: true },(err)=>{
if(err)
console.log(err)
else
console.log("Database Connected")
});
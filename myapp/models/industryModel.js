var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var industrySchema = mongoose.Schema({
    
    name: { type: String ,require:true },
    
},{collection:'industry'})  

module.exports = mongoose.model('industry',industrySchema);
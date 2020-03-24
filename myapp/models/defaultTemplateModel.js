var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var templateModel = mongoose.Schema({
    
    txtTemplateText:{type:String},
    txtTemplateName:{type:String},
    txtSubject:{type:String},
    
},{collection:'default_template'})  

module.exports = mongoose.model('default_template',templateModel);
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var templateModel = mongoose.Schema({
    
    txtTemplateText:{type:String},
    txtTemplateName:{type:String},
    txtSubject:{type:String},
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
    
},{collection:'template'})  

module.exports = mongoose.model('template',templateModel);
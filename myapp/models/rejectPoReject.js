var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var rejectReasonSchema = mongoose.Schema({   
    traderId :{ type: Schema.Types.ObjectId, ref: 'trader' },
    message: String,
    created: Date,
    
},{collection:'rejectReason'})  

module.exports = mongoose.model('rejectReason',rejectReasonSchema);
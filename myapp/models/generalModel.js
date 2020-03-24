var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var generalConfugurationSchema = mongoose.Schema({
    
    tax_label: { type: String },
    tax_number_label: { type: String  },
    tax_number: { type: String  },
    warn_on_shipping : { type: String },
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
    
},{collection:'generalConfuguration'})  

module.exports = mongoose.model('generalConfugurationModel',generalConfugurationSchema);
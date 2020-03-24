var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var locationModelSchema = mongoose.Schema({
    label: { type: String },
    street1: { type: String  },
    street2: { type: String  },
    suburb : { type: String },
    city: {  type: String },
    state: { type: String },
    postal_code: { type: String  },
    txtCountry: { type: String  },
    hold_stock : { type: Boolean,default:false },
    default:{type:Boolean,default:false},
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
},{collection:'locationModel'})  

module.exports = mongoose.model('locationModel',locationModelSchema);
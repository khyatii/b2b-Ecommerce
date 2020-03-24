var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var currencySchema = mongoose.Schema({   
      currency_name: { type: String },
      iso3: { type: String  },
      symbol: { type: String  },
      txtExchangeRate : { type: String },
      default:{type:Boolean},
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
    
},{collection:'currency'})  

module.exports = mongoose.model('currency',currencySchema);
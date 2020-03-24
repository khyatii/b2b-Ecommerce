var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var permissionSchema = mongoose.Schema({   
    traderId :{ type: Schema.Types.ObjectId, ref: 'trader' },
    member:[
      { memberId: { type: Schema.Types.ObjectId, ref: 'trader' },
        modules: [{
            moduleName:{ type:String},
            permission:{type: String}}]
        }  
    ]
    
    
},{collection:'permission'})  

module.exports = mongoose.model('permission',permissionSchema);
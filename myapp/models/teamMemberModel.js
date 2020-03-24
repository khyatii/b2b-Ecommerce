var mongoose = require('mongoose')

var Schema = mongoose.Schema;
var moduleSchema = mongoose.Schema(
    {name:{type: String},
    permission:{type: String}
})

var memberSchema = mongoose.Schema({
        memberId:{ type: Schema.Types.ObjectId, ref: 'trader' },
        firstName:{type:String}, 
        lastName:{type:String},
        module:[moduleSchema]
})


var teamMemberSchema = mongoose.Schema({
    traderId: { type: Schema.Types.ObjectId, ref: 'trader' },
    member:[memberSchema]
},{collection:'teamMember'})  

module.exports = mongoose.model('teamMember',teamMemberSchema);

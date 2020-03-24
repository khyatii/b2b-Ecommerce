const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    userName: String,
    userEmail: { type: String, require: true, unique: true },
    phone_number: String,
    userLocation: String,
    trader:String,
    userGender:{type:String, default:null},
    userBio:{type:String, default:null}
})

const Profile = mongoose.model('profile', profileSchema)

module.exports = Profile;

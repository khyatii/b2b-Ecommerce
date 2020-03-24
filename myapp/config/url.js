
const env = process.env.NODE_ENV;

if (env == 'production') {
    var constants = {
        dbUrl: "mongodb://demo:demo@ds135757.mlab.com:35757/rxzone",
        // dbUrl: "mongodb://ec2-13-127-188-236.ap-south-1.compute.amazonaws.com:27017/nicozaProduction",
        serverUrl: "http://13.127.188.236:8000",
        clientUrl: "http://ec2-13-127-188-236.ap-south-1.compute.amazonaws.com"
    }
}

if (env == 'local') {
    var constants = {
        dbUrl: "mongodb://nicoza:nicoza123@ds145146.mlab.com:45146/nicoza",
        serverUrl: "http://localhost:8000",
        clientUrl: "http://localhost:7000"
    }
}

module.exports = constants;

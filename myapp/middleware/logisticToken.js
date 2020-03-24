var logisticsPofileModel = require('../models/logisticsPofileModel')
const jwt = require('jsonwebtoken');

var logisticToken = function(req,res,next){
  let tokenHolder = req.headers['authorization'].split(' ');
  const token = tokenHolder[1];
  jwt.verify(token, 'secret1', (err, authData) => {
    if (err) res.sendStatus(403);
    if (authData !== 'undefined') {
      logisticsPofileModel.find({ 'email': authData.user.email }, function (err, doc) {
        if (err) {
          console.log(err);
          res.status(404).send({ message: err })
          return;
        }
        req.body.logisticsId = doc[0]._id;
        req.body.logisticsEmail = doc[0].email;
        req.body.logisticsType = doc[0].logistics_type;
        next();
      })
      return;
    }
  })

}

module.exports = logisticToken;

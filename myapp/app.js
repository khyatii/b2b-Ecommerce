const express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  db = require('./config/dbconfig'),
  url = require('url');

const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const sock = require('./routes/socket')(io);


const index = require('./routes/index'),
  users = require('./routes/users'),
  logisticsProfile = require('./routes/logisticsProfile'),
  template = require('./routes/template'),
  customerProfile = require('./routes/customerProfile'),
  configuration = require('./routes/configuration'),
  vasService = require('./routes/vasService'),
  productDiscount = require('./routes/productDiscount'),
  customerGroup = require('./routes/customerGroup'),
  product = require('./routes/product'),
  vasServiceSubscribe = require('./routes/vasServiceSubscribe'),
  transportManagement = require('./routes/transportManagement'),
  locationManagement = require('./routes/locationManagement'),
  clearingManagement = require('./routes/clearingManagement'),
  warehouse = require('./routes/warehouse'),
  supplier = require('./routes/supplier'),
  teamMember = require('./routes/teamMember'),
  approvalProcess = require('./routes/approvalProcess').router,
  category = require('./routes/category'),
  inventoryLocation = require('./routes/inventoryLocation'),
  requestQuotation = require('./routes/requestQuotation'),
  crowdSourcing = require('./routes/crowdSourcing'),
  issuePO = require('./routes/issuePO'),
  orders = require('./routes/orders'),
  returns = require('./routes/returns'),
  invoice = require('./routes/invoice'),
  invoiceLogistics = require('./routes/invoiceLogistics'),
  notification = require('./routes/notification'),
  logisticLocations = require('./routes/logisticLocations'),
  insuranceManagement = require('./routes/insuranceManagement'),
  logisticsCatalogue = require('./routes/logisticsCatalogue'),
  warehousePo = require('./routes/warehousePo'),
  transportPo = require('./routes/transportPo'),
  clearingPo = require('./routes/clearingPo'),
  insurancePo = require('./routes/insurancePo'),
  shopify = require('./routes/shopify'),
  contactSupplierApi = require('./routes/contactSupplier');

const cacheMiddleware = require('./middleware/cache')
const fileUpload = require('express-fileupload');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static('uploads'))
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicologisticLocationspath.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('logisticLocationsv'));

app.use(cors());
app.use(function (req, res, next) {
  //set headers to allow cross origin request.
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('', users);
app.use('/logistics', logisticsProfile);
app.use('/config', configuration);
app.use('/product', product);
app.use('/template', template);
app.use('/customerProfile', customerProfile);
app.use('/vasService', vasService);
app.use('/vasServiceSubscribe', vasServiceSubscribe);
app.use('/warehouse', warehouse);
app.use('/insuranceManagement', insuranceManagement);
app.use('/transportManagement', transportManagement);
app.use('/clearingManagement', clearingManagement);
app.use('/productDiscount', productDiscount);
app.use('/customerGroup', customerGroup);
app.use('/supplier', supplier);
app.use('/teamMember', teamMember);
app.use('/locationManagement', locationManagement);
app.use('/category', category);
app.use('/approvalProcess', approvalProcess);
app.use('/inventoryLocation', inventoryLocation);
app.use('/requestQuotation', requestQuotation);
app.use('/crowdSourcing', crowdSourcing);
app.use('/issuePO', issuePO);
app.use('/orders', orders);
app.use('/returns', returns);
app.use('/invoice', invoice);
app.use('/invoiceLogistics', invoiceLogistics);
app.use('/notification', notification);
app.use('/logisticLocations', logisticLocations);
app.use('/logisticsCatalogue', logisticsCatalogue);
app.use('/warehousePo', warehousePo);
app.use('/transportPo', transportPo);
app.use('/clearingPo', clearingPo);
app.use('/insurancePo', insurancePo);
app.use('/shopify', shopify);
app.use('/contactSupplier', contactSupplierApi); //contact suppliers

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
var port = process.env.PORT || 8000
app.set('port', port);

/**
 * Create HTTP server.
 */



/**
 * Listen on provided port, on all network interfaces.
 */
http.listen(port, function () {
  console.log("server started " + port)
});


module.exports = app;
// module.exports = hostname;

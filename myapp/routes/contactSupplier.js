const express = require('express'),
    router = express.Router(),
    ContactSupplier = require('../models/contactSupplierModel'),
    token = require('../middleware/token'),
    nodemailer = require('nodemailer'),
    transporter = require('../config/mailconfig');

//contact supplier api to save user data about product
router.post('/postContactSupplier', function (req, res, next) {
    const data = req.body;
    let contactSupplier = new ContactSupplier({
        name: data.name,
        phone: data.phone,
        email: data.email,
        callingCode: data.calling_code,
        city: data.city,
        query: data.query,
        seller: data.seller,
        product: data.product,
        created_at: Date.now()
    });
    contactSupplier.save((err, resp) => {
        if (err) {
            return res.status(404).send(err);
        }
        else {
            ContactSupplier.find({ '_id': resp._id }).populate([
                {
                    path: 'seller',
                    model: 'trader'
                }
            ]).exec(function (err, doc) {
                if (err) {
                    res.status(404).send(err)
                    return;
                }
                res.status(201).json({
                    message: 'details saved successfully',
                    data: doc[0],
                    postStatus: 1
                });
                sendMailToBuyer(data, doc);
                sendMailToSeller(data, doc);
            })
        }
    });
});

router.get('/getContactSupplier', token, (req, res, next) => {
    //get contact queries on all products where userID;
    ContactSupplier.find({ 'seller': req.body.traderId }).sort({ created_at: -1 }).populate([
        {
            path: 'product',
            model: 'productSeller',
            populate: {
                path: 'productId',
                model: 'product'
            }
        }
    ]).exec(function (err, doc) {
        if (err) {
            res.status(404).send(err)
            return;
        }
        res.status(200).send(doc);
    });
});

function sendMailToBuyer(data, sellerInfo) {
    nodemailer.createTestAccount((err, account) => {
        var mailOptions = {
            from: '"Nicoza " <rxzone@gmail.com>',
            to: data.email,
            subject: `Contacted to Supplier: ${sellerInfo[0].seller.registration_name}`,
            html: `<div class="container" style="font-family: Montserrat;font-size: 17px;">
                                <div class="row" style="margin-top:1em;width: calc(50% + 150px); margin: auto">
                                   <div class="col-lg-2 col-sm-1 col-xs-1"></div>
                                   <div class="col-lg-8 col-sm-10 col-xs-10" style="">
                                     <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                                     <div>
                                       <p>Dear <b>${data.name}</b>,</p>
                                       <p style="line-height: 1.2">Thanks for contacting us.<br><br>
                                        Our company sells All kind of Products on Nicoza, and we’re interested in expanding our product line to include <b>${data.product.productId.txtProductName}</b>.<br><br>
                                        We are interested in building a long-term relationship with you as a supplier if it makes sense for both of us.<br>
                                        We are ready to move forward with this product.If you can accommodate our request, we would like to talk more about moving forward with an order.<br><br>
                                        We look forward to hearing from you.<br><br>   
                                       <p style="margin-top: 1em;">Thank you,</p>
                                       <p>The Nicoza Team</p>
                                     </div>
                                     <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                                     <center style="margin-top:2em; line-height: 1.2;font-size:13px">
                                     <p style="margin:0">
                                     <span style="display:inline-flex;padding-right:140px;">Contact</span>
                                     <span>Privacy Policy</span></p>
                                         <p>This message was sent by Nicoza</p>
                                     </center>
                                   </div>
                                  <div class="col-lg-2 col-sm-1 col-xs-1"></div>
                                  </div>
                                 </div>`
        };
        transporter.sendMail(mailOptions, function (err, information) {
            if (err) { }
        })
    });
}

function sendMailToSeller(data, sellerInfo) {
    let askQuery;
    if (sellerInfo[0].query == null) askQuery = '';
    else askQuery = sellerInfo[0].query;
    nodemailer.createTestAccount((err, account) => {
        var mailOptions = {
            from: '"Nicoza " <rxzone@gmail.com>',
            to: sellerInfo[0].seller.email,
            subject: `Buyer Contact for product: ${data.product.productId.txtProductName} `,
            html: `<div class="container" style="font-family: Montserrat;font-size: 17px;">
                    <div class="row" style="margin-top:1em;width: calc(50% + 150px); margin: auto">
                       <div class="col-lg-2 col-sm-1 col-xs-1"></div>
                       <div class="col-lg-8 col-sm-10 col-xs-10" style="">
                         <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                         <div>
                           <p>Dear <b>${sellerInfo[0].seller.registration_name}</b>,</p>
                           <p style="line-height: 1.2">Buyer <b>${sellerInfo[0].name}</b>, has requested to contact your for your product <b>${data.product.productId.txtProductName}</b>.<br><br>     
                            <b>Buyer's Info:</b><br>
                            Name: ${sellerInfo[0].name}<br>
                            Email: ${sellerInfo[0].email}<br>
                            Mobile: ${sellerInfo[0].callingCode} ${sellerInfo[0].phone}<br>
                            City: ${sellerInfo[0].city}<br>
                            Query: ${askQuery}<br><br>   
                           <p style="margin-top: 1em;">Thank you,</p>
                           <p>The Nicoza Team</p>
                         </div>
                         <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                         <center style="margin-top:2em; line-height: 1.2;font-size:13px">
                         <p style="margin:0">
                         <span style="display:inline-flex;padding-right:140px;">Contact</span>
                         <span>Privacy Policy</span></p>
                            <p>This message was sent by Nicoza</p>
                         </center>
                       </div>
                      <div class="col-lg-2 col-sm-1 col-xs-1"></div>
                      </div>
                     </div>`
        };
        transporter.sendMail(mailOptions, function (err, information) {
            if (err) { }
        })
    });
}


module.exports = router;

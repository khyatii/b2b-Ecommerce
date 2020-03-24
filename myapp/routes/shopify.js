const express = require('express');
const router = express.Router();
const request = require('request');
const dotenv = require('dotenv').config();
const cookie = require('cookie');
const async = require('async')
const nonce = require('nonce');
const crypto = require('crypto');
const querystring = require('querystring');
const requestPromise = require('request-promise');
const ShopifyToken = require('shopify-token');

const scopes = "write_products";
const forwardingAddress = process.env.HOST;

var shopifyToken = new ShopifyToken({
    sharedSecret: process.env.SHOPIFY_API_SECRET,
    redirectUri: forwardingAddress + '/shopify/callback',
    apiKey: process.env.SHOPIFY_API_KEY
})

router.get('/shopify', (req, res, next) => {
    const shop = req.query.shop;
    if (!shop) {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request')
    }
    const shopRegex = /^([\w-]+)\.myshopify\.com/i
    const shopName = shopRegex.exec(shop)[1]
    const state = shopifyToken.generateNonce();
    const url = shopifyToken.generateAuthUrl(shopName, scopes, state);
    res.cookie('state', state);
    res.redirect(url);
});

router.get('/shopify/callback', (req, res, next) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if (state !== stateCookie) {
        // you are unable to set proper state ("nonce") in this case, thus you are getting this error
        return res.status(403).send('Request origin cannot be verified')
    }
    if (!shop || !hmac || !code) {
        res.status(400).send('Required parameters missing')
    }
    let hmacVerified = shopifyToken.verifyHmac(req.query)
    console.log(`verifying -> ${hmacVerified}`)

    // DONE: Validate request is from Shopify
    if (!hmacVerified) {
        return res.status(400).send('HMAC validation failed')
    }
    const accessToken = shopifyToken.getAccessToken(shop, code);
    const shopRequestUrl = 'https://' + shop + '/admin/products.json'
    const shopRequestHeaders = {
        'X-Shopify-Access-Token': accessToken
    }
    try {
        const shopResponse = requestPromise.get(shopRequestUrl, { headers: shopRequestHeaders })
        res.status(200).send(shopResponse)
    } catch (error) {
        res.status(error.statusCode).send(error.error.error_description)
    }

});

module.exports = router;
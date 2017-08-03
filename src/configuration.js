/**
 * @file ./configuration.js
 * @copyright Jon Perkowski 2017
 */
/**
 * Environment configuration for QuickOrder
 * @module configuration
 *
 */

'use strict';

const config = {
    // TODO Add Application ID
    appId : 'amzn1.ask.skill.70cc563b-c7ab-4ac3-9977-7c28e008b45f',
    dbRegion : 'us-east-1',
    webappEndpoint : 'http://foodhub-order.s3-website-us-east-1.amazonaws.com/orderDetail',
    saveMessageTopic : 'arn:aws:sns:us-east-1:229098516273:quickOrderSaved'
};

module.exports = config;
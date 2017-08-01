'use strict';
/**
 * @file ./index.js
 * @copyright Jon Perkowski 2017
 */
/**
 * Parent module for QuickOrder
 * @module index
 *
 */
 
const Alexa = require('alexa-sdk');
const config = require('./configuration');
const statelessHandlers = require('./statelessHandlers');
const eventHandlers = require('./eventHandlers');
const speechHandlers = require('./speechHandlers');
/*const constants = require('./constants');*/

/** Alexa skill handler */
exports.handler = function(event, context, callback){
	console.info("new session: " + JSON.stringify(event.session.sessionId));
    let alexa = Alexa.handler(event, context);
    alexa.appId = config.appId;
    
    alexa.registerHandlers(
    	statelessHandlers, 
    	eventHandlers.statelessHandlers,
    	speechHandlers.statelessHandlers
    );
    alexa.execute();
};
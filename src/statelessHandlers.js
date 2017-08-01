/**
 * @file ./statelessHandlers.js
 * @copyright Jon Perkowski 2017
 */
/**
 * Handles stateless Intent requests from Amazon Alexa
 * @module statelessHandlers
 *
 */

const constants = require('./constants');

/** statelessHandlers - handlers for stateless Intents */
let statelessHandlers = {};

/** stateless handler for launch intent. Starts new session */
statelessHandlers[constants.intents.LAUNCH_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.LAUNCH_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.attributes['lastSpeech'] =  null;
	this.emit(constants.events.NEW_SESSION);
};

/** stateless handler for order product intent. Adds product to order */
statelessHandlers[constants.intents.ORDER_PRODUCT_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.ORDER_PRODUCT_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(constants.events.ADD_PRODUCT);
};

/** stateless handler for order product with quantity intent. Adds product to order with quantity */
statelessHandlers[constants.intents.ORDER_PRODUCT_WITH_QUANTITY_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.ORDER_PRODUCT_WITH_QUANTITY_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(constants.events.ADD_PRODUCT);
};

/** stateless handler for order quantity intent. Asks for product for given quantity */
statelessHandlers[constants.intents.ORDER_QUANTITY_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.ORDER_QUANTITY_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(constants.events.ADD_PRODUCT);
};

/** stateless handler for repeat order intent. Repeats current order */
statelessHandlers[constants.intents.REPEAT_ORDER_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.REPEAT_ORDER_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(constants.speeches.REPEAT_ORDER_SPEECH);
};

/** stateless handler for finish order intent. Puts order to FINISH_MODE state. Asks for confirmation */
statelessHandlers[constants.intents.FINISH_ORDER_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.FINISH_ORDER_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(constants.speeches.FINISH_ORDER_SPEECH);
};

/** stateless handler for cancel order intent. Puts order to CANCEL_MODE state. Asks for confirmation */
statelessHandlers[constants.intents.CANCEL_ORDER_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.CANCEL_ORDER_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(constants.speeches.CANCEL_ORDER_SPEECH);
};

/** stateless handler for session ended intent. Exits and saves to database */
statelessHandlers[constants.intents.SESSION_ENDED_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.SESSION_ENDED_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(constants.events.SAVE_ORDER);
};

/** stateless handler for yes intent. Yes intent is unhandled when stateless */
statelessHandlers[constants.intents.YES_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.YES_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(constants.speeches.UNHANDLED_SPEECH);
};

/** stateless handler for no intent. No intent is unhandled when stateless */
statelessHandlers[constants.intents.NO_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.NO_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(constants.speeches.UNHANDLED_SPEECH);
};

/** stateless handler for repeat intent. Repeats last speech */
statelessHandlers[constants.intents.REPEAT_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.REPEAT_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(constants.speeches.REPEAT_SPEECH);
};

/** stateless handler for help intent. Gives help and hints */
statelessHandlers[constants.intents.HELP_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.HELP_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(constants.speeches.HELP_SPEECH);
};

/** stateless handler for stop intent. Puts order to CANCEL_MODE state. Asks for confirmation */
statelessHandlers[constants.intents.STOP_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.STOP_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(constants.speeches.CANCEL_ORDER_SPEECH);
};

/** stateless handler for cancel intent. Puts order to CANCEL_MODE state. Asks for confirmation */
statelessHandlers[constants.intents.CANCEL_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.STOP_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(constants.speeches.CANCEL_ORDER_SPEECH);
};

/** stateless handler for unexpected prompts from user */
statelessHandlers[constants.intents.UNHANDLED_INTENT] = function(){
	console.warn('WARNING Intent handler ' + constants.intents.UNHANDLED_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(constants.speeches.UNHANDLED_SPEECH);
};

module.exports = statelessHandlers;
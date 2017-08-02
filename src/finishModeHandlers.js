/**
 * @file ./finishModeHandlers.js
 * @copyright Jon Perkowski 2017
 */
/**
 * Handles finish mode Intent requests from Amazon Alexa
 * @module finishModeHandlers
 *
 */

const Alexa = require('alexa-sdk');
const constants = require('./constants');

/** finishModeHandlers - handlers for stateless Intents */
let intents = {};

/** finish mode handler for launch intent. Unhandled in finish mode */
intents[constants.intents.LAUNCH_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.LAUNCH_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.attributes['lastSpeech'] =  null;
	this.emitWithState(constants.speeches.UNHANDLED_SPEECH);
};

/** finish mode handler for order product intent. Unhandled in finish mode */
intents[constants.intents.ORDER_PRODUCT_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.ORDER_PRODUCT_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emitWithState(constants.speeches.UNHANDLED_SPEECH);
};

/** finish mode handler for order product with quantity intent. Unhandled in finish mode */
intents[constants.intents.ORDER_PRODUCT_WITH_QUANTITY_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.ORDER_PRODUCT_WITH_QUANTITY_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emitWithState(constants.speeches.UNHANDLED_SPEECH);
};

/** finish mode handler for order quantity intent. Unhandled in finish mode */
intents[constants.intents.ORDER_QUANTITY_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.ORDER_QUANTITY_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emitWithState(constants.speeches.UNHANDLED_SPEECH);
};

/** finish mode handler for repeat order intent. Repeats current order */
intents[constants.intents.REPEAT_ORDER_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.REPEAT_ORDER_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emitWithState(constants.speeches.REPEAT_ORDER_SPEECH);
};

/** finish mode handler for finish order intent. Unhandled in finish mode */
intents[constants.intents.FINISH_ORDER_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.FINISH_ORDER_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emitWithState(constants.speeches.UNHANDLED_SPEECH);
};

/** finish mode handler for cancel order intent. Puts order to CANCEL_MODE state. Asks for confirmation */
intents[constants.intents.CANCEL_ORDER_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.CANCEL_ORDER_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emitWithState(constants.speeches.CANCEL_ORDER_SPEECH);
};

/** finish mode handler for session ended intent. Exits and saves to database */
intents[constants.intents.SESSION_ENDED_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.SESSION_ENDED_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emitWithState(constants.events.CANCEL_ORDER);
};

/** finish mode handler for yes intent. Exits and saves to database */
intents[constants.intents.YES_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.YES_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emitWithState(constants.events.SAVE_ORDER);
};

/** finish mode handler for no intent. Returns to normal order */
intents[constants.intents.NO_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.NO_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emitWithState(constants.events.CONTINUE_ORDER);
};

/** finish mode handler for repeat intent. Repeats last speech */
intents[constants.intents.REPEAT_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.REPEAT_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emitWithState(constants.speeches.REPEAT_SPEECH);
};

/** finish mode handler for help intent. Gives help and hints */
intents[constants.intents.HELP_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.HELP_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emitWithState(constants.speeches.HELP_SPEECH);
};

/** finish mode handler for stop intent. Returns to normal order */
intents[constants.intents.STOP_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.STOP_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emitWithState(constants.events.CONTINUE_ORDER);
};

/** finish mode handler for cancel intent. Returns to normal order */
intents[constants.intents.CANCEL_INTENT] = function(){
	console.info('Intent handler ' + constants.intents.STOP_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emitWithState(constants.events.CONTINUE_ORDER);
};

/** finish mode handler for unexpected prompts from user */
intents[constants.intents.UNHANDLED_INTENT] = function(){
	console.warn('WARNING Intent handler ' + constants.intents.UNHANDLED_INTENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emitWithState(constants.speeches.UNHANDLED_SPEECH);
};

let finishModeHandlers = Alexa.CreateStateHandler(constants.states.FINISH_MODE, intents);

module.exports = finishModeHandlers;
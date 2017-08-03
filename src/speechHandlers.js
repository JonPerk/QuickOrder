/**
 * @file ./speechHandlers.js
 * @copyright Jon Perkowski 2017
 */

/**
 * Handles speech output for QuickOrder
 * @module speechHandlers
 *
 */

var Alexa = require('alexa-sdk');
var constants = require('./constants');

var speechHandlers = {};

/** welcome speech handler, asks user for products */
speechHandlers[constants.speeches.WELCOME_SPEECH] = function(){
	console.info('Speech handler ' + constants.speeches.WELCOME_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.attributes.speechOutput = constants.speechOutputs.WELCOME_SPEECH;
    this.attributes.repromptSpeech = constants.reprompts.WELCOME_SPEECH;
	this.emit(
		':askWithCard', 
		this.attributes.speechOutput, 
		this.attributes.repromptSpeech,
		constants.cardTitles.WELCOME_CARD,
		constants.cards.WELCOME_CARD
	);
};

/** repeats current order */
speechHandlers[constants.speeches.REPEAT_ORDER_SPEECH] = function(){
	console.info('Speech handler ' + constants.speeches.REPEAT_ORDER_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.attributes.speechOutput = constants.speechOutputs.REPEAT_ORDER_SPEECH;
	this.attributes.speechOutput = this.attributes.speechOutput.replace('%s', this.attributes.repeatOrderSpeech);
    this.attributes.repromptSpeech = constants.reprompts.REPEAT_ORDER_SPEECH;
    this.attributes.repromptSpeech = this.attributes.repromptSpeech.replace('%s', this.attributes.repeatOrderSpeech);
	this.emit(
		':askWithCard',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech,
		constants.cardTitles.REPEAT_ORDER,
		this.attributes.repeatOrderText
	);
};

/** repeats current order if user has more than 3 products in order */
speechHandlers[constants.speeches.REPEAT_ORDER_MULTI_SPEECH] = function(){
	console.info('Speech handler ' + constants.speeches.REPEAT_ORDER_MULTI_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.attributes.speechOutput = constants.speechOutputs.REPEAT_ORDER_MULTI_SPEECH;
	this.attributes.speechOutput = this.attributes.speechOutput.replace('%s', this.attributes.repeatOrderSpeech);
    this.attributes.repromptSpeech = constants.reprompts.REPEAT_ORDER_MULTI_SPEECH;
    this.attributes.repromptSpeech = this.attributes.repromptSpeech.replace('%s', this.attributes.repeatOrderSpeech);
    this.emit(
		':askWithCard',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech,
		constants.cardTitles.REPEAT_ORDER,
		this.attributes.repeatOrderText
	);
};

/** repeats current order */
speechHandlers[constants.speeches.NO_PRODUCTS_SPEECH] = function(){
	console.info('Speech handler ' + constants.speeches.NO_PRODUCTS_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.attributes.speechOutput = constants.speechOutputs.NO_PRODUCTS_SPEECH;
    this.attributes.repromptSpeech = constants.reprompts.NO_PRODUCTS_SPEECH;
	this.emit(
		':ask',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech
	);
};

/** repeats whatever was said last */
speechHandlers[constants.speeches.REPEAT_SPEECH] = function(){
	console.info('Speech handler ' + constants.speeches.REPEAT_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(
		':ask',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech
	);
};

/** asks if user wants to finish order */
speechHandlers[constants.speeches.FINISH_ORDER_SPEECH] = function(){
	console.info('Speech handler ' + constants.speeches.FINISH_ORDER_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.handler.state = constants.states.FINISH_MODE;
	this.attributes.speechOutput = constants.speechOutputs.FINISH_ORDER_SPEECH;
	this.attributes.repromptSpeech = constants.reprompts.FINISH_ORDER_SPEECH;
	this.emit(
		':ask',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech
	);
};

/** incorrect speech handler. informs user and asks if they want to try again */
speechHandlers[constants.speeches.CANCEL_ORDER_SPEECH] = function(){
	console.info('Speech handler ' + constants.speeches.CANCEL_ORDER_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.handler.state = constants.states.CANCEL_MODE;
	this.attributes.speechOutput = constants.speechOutputs.CANCEL_ORDER_SPEECH;
	this.attributes.repromptSpeech = constants.reprompts.CANCEL_ORDER_SPEECH;
	this.emit(
		':ask',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech
	);
};

/** tells user they can continue with their order */
speechHandlers[constants.speeches.CONTINUE_ORDER_SPEECH] = function(){
	console.info('Speech handler ' + constants.speeches.CONTINUE_ORDER_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.handler.state = null;
	this.attributes.STATE = undefined;
	this.attributes.speechOutput = constants.speechOutputs.CONTINUE_ORDER_SPEECH;
	this.attributes.repromptSpeech = constants.reprompts.CONTINUE_ORDER_SPEECH;
	this.emit(
		':ask',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech
	);
};

/** notifies user of recoverable failure and continues */
speechHandlers[constants.speeches.ERROR_SPEECH] = function(){
	console.error('ERROR Speech handler ' + constants.speeches.ERROR_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
	this.attributes.speechOutput = constants.speechOutputs.ERROR_SPEECH;
	this.attributes.repromptSpeech = constants.reprompts.ERROR_SPEECH + constants.reprompts.HELP_SPEECH;
	this.emit(
		':ask',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech
	);
};

/** informs user of saved order and exits */
speechHandlers[constants.speeches.ORDER_SAVED_SPEECH] = function(){
	console.log('Speech handler ' + constants.speeches.ORDER_SAVED_SPEECH + ' called for ' + this.event.session.sessionId + " session ending");
	this.emit(":tellWithCard", 
			constants.speechOutputs.ORDER_SAVED_SPEECH, 
			constants.cardTitles.ORDER_SAVED,
			constants.cards.ORDER_SAVED);
}

/** notifies user of cancelled order and exits */
speechHandlers[constants.speeches.ORDER_CANCELLED_SPEECH] = function(){
	console.log('Speech handler ' + constants.speeches.ORDER_CANCELLED_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
	this.emit(":tellWithCard", 
			constants.speechOutputs.ORDER_CANCELLED_SPEECH, 
			constants.cardTitles.ORDER_CANCELLED,
			constants.cards.ORDER_CANCELLED);
};

/** notifies user of that product was successfully added */
speechHandlers[constants.speeches.PRODUCT_ADDED_SPEECH] = function(){
	console.log('Speech handler ' + constants.speeches.PRODUCT_ADDED_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
	let product = this.attributes.order.products[this.attributes.order.products.length-1]
	if(product.quantity === 1){
		this.attributes.speechOutput = constants.speechOutputs.PRODUCT_ADDED_SINGLE_SPEECH;
		this.attributes.speechOutput = this.attributes.speechOutput.replace('%s', product.prodname);
		this.attributes.speechOutput = this.attributes.speechOutput.replace('%d', product.quantity);
	    this.attributes.repromptSpeech = constants.reprompts.PRODUCT_ADDED_SINGLE_SPEECH;
	    this.attributes.repromptSpeech = this.attributes.repromptSpeech.replace('%s', product.prodname);
		this.attributes.repromptSpeech = this.attributes.repromptSpeech.replace('%d', product.quantity);
	} else {
		this.attributes.speechOutput = constants.speechOutputs.PRODUCT_ADDED_SPEECH;
		this.attributes.speechOutput = this.attributes.speechOutput.replace('%s', product.prodname);
		this.attributes.speechOutput = this.attributes.speechOutput.replace('%d', product.quantity);
	    this.attributes.repromptSpeech = constants.reprompts.PRODUCT_ADDED_SPEECH;
	    this.attributes.repromptSpeech = this.attributes.repromptSpeech.replace('%s', product.prodname);
		this.attributes.repromptSpeech = this.attributes.repromptSpeech.replace('%d', product.quantity);
	}
	let card = constants.cards.PRODUCT_ADDED;
    card = card.replace('%s', product.prodname);
	card = card.replace('%d', product.quantity);
    this.emitWithState(
		':askWithCard',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech,
		constants.cardTitles.PRODUCT_ADDED,
		card
	);
};

/** notifies user that product is found and asks for quantity */
speechHandlers[constants.speeches.PRODUCT_STARTED_SPEECH] = function(){
	console.log('Speech handler ' + constants.speeches.PRODUCT_STARTED_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
	this.attributes.speechOutput = constants.speechOutputs.PRODUCT_STARTED_SPEECH;
	this.attributes.speechOutput = this.attributes.speechOutput.replace('%s', this.attributes.currentProduct.prodname);
    this.attributes.repromptSpeech = constants.reprompts.PRODUCT_STARTED_SPEECH;
    this.attributes.repromptSpeech = this.attributes.repromptSpeech.replace('%s', this.attributes.currentProduct.prodname);
    this.emit(
		':ask',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech
	);
};

/** notifies user that quantity was accepted and asks for product */
speechHandlers[constants.speeches.QUANTITY_STARTED_SPEECH] = function(){
	console.log('Speech handler ' + constants.speeches.QUANTITY_STARTED_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
	if(this.attributes.currentProduct.quantity === 1){
		this.attributes.speechOutput = constants.speechOutputs.QUANTITY_STARTED_SINGLE_SPEECH;
		this.attributes.speechOutput = this.attributes.speechOutput.replace('%d', this.attributes.currentProduct.quantity);
	    this.attributes.repromptSpeech = constants.reprompts.QUANTITY_STARTED_SINGLE_SPEECH;
	    this.attributes.repromptSpeech = this.attributes.repromptSpeech.replace('%d', this.attributes.currentProduct.quantity);
	} else {
		this.attributes.speechOutput = constants.speechOutputs.QUANTITY_STARTED_SPEECH;
		this.attributes.speechOutput = this.attributes.speechOutput.replace('%d', this.attributes.currentProduct.quantity);
	    this.attributes.repromptSpeech = constants.reprompts.QUANTITY_STARTED_SPEECH;
	    this.attributes.repromptSpeech = this.attributes.repromptSpeech.replace('%d', this.attributes.currentProduct.quantity);
	}
    this.emit(
		':ask',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech
	);
};

/** notifies user that there is already an in progress product if they try to order another */
speechHandlers[constants.speeches.PRODUCT_IN_PROGRESS_SPEECH] = function(){
	console.log('Speech handler ' + constants.speeches.PRODUCT_IN_PROGRESS_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
	this.attributes.speechOutput = constants.speechOutputs.PRODUCT_IN_PROGRESS_SPEECH;
	this.attributes.speechOutput = this.attributes.speechOutput.replace('%s', this.attributes.currentProduct.prodname);
    this.attributes.repromptSpeech = constants.reprompts.PRODUCT_IN_PROGRESS_SPEECH;
    this.attributes.repromptSpeech = this.attributes.repromptSpeech.replace('%s', this.attributes.currentProduct.prodname);
    this.emit(
		':ask',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech
	);
};

/** notifies user that there is already an in progress quantity if they try to set another */
speechHandlers[constants.speeches.QUANTITY_IN_PROGRESS_SPEECH] = function(){
	console.log('Speech handler ' + constants.speeches.QUANTITY_IN_PROGRESS_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
	if(this.attributes.currentProduct.quantity === 1){
		this.attributes.speechOutput = constants.speechOutputs.QUANTITY_IN_PROGRESS_SINGLE_SPEECH;
		this.attributes.speechOutput = this.attributes.speechOutput.replace('%d', this.attributes.currentProduct.quantity);
	    this.attributes.repromptSpeech = constants.reprompts.QUANTITY_IN_PROGRESS_SINGLE_SPEECH;
	    this.attributes.repromptSpeech = this.attributes.repromptSpeech.replace('%d', this.attributes.currentProduct.quantity);
	} else {
		this.attributes.speechOutput = constants.speechOutputs.QUANTITY_IN_PROGRESS_SPEECH;
		this.attributes.speechOutput = this.attributes.speechOutput.replace('%d', this.attributes.currentProduct.quantity);
	    this.attributes.repromptSpeech = constants.reprompts.QUANTITY_IN_PROGRESS_SPEECH;
	    this.attributes.repromptSpeech = this.attributes.repromptSpeech.replace('%d', this.attributes.currentProduct.quantity);
	}
    this.emit(
		':ask',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech
	);
};

/** notifies user that requested product is not found or available */
speechHandlers[constants.speeches.PRODUCT_NOT_FOUND_SPEECH] = function(){
	console.log('Speech handler ' + constants.speeches.PRODUCT_NOT_FOUND_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
	this.attributes.speechOutput = constants.speechOutputs.PRODUCT_NOT_FOUND_SPEECH;
    this.attributes.repromptSpeech = constants.reprompts.PRODUCT_NOT_FOUND_SPEECH;
	this.emit(
		':ask',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech
	);
};

/** informs user that a product was removed from the order */
speechHandlers[constants.speeches.PRODUCT_REMOVED_SPEECH] = function(){
	console.log('Speech handler ' + constants.speeches.PRODUCT_REMOVED_SPEECH + ' called for ' + this.event.session.sessionId + " session ending");
	this.attributes.speechOutput = constants.speechOutputs.PRODUCT_REMOVED_SPEECH;
    this.attributes.repromptSpeech = constants.reprompts.PRODUCT_REMOVED_SPEECH;
	this.emit(
		':ask',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech
	);
};

/** gives the user tips and help */
speechHandlers[constants.speeches.HELP_SPEECH] = function(){
	console.info('Speech handler ' + constants.speeches.HELP_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.attributes.speechOutput = constants.speechOutputs.HELP_SPEECH;
	this.attributes.repromptSpeech = constants.reprompts.HELP_SPEECH;
	this.emit(
		':ask',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech
	);
};

/** notifies user of recoverable failure and asks if they want to continue */
speechHandlers[constants.speeches.UNHANDLED_SPEECH] = function(){
	console.warn('WARNING Speech handler ' + constants.speeches.UNHANDLED_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
	this.attributes.speechOutput = constants.speechOutputs.UNHANDLED_SPEECH;
	this.attributes.repromptSpeech = constants.reprompts.UNHANDLED_SPEECH + constants.reprompts.HELP_SPEECH;
	this.emit(
		':ask',
		this.attributes.speechOutput,
		this.attributes.repromptSpeech
	);
};
 
let finishMode = Object.assign({}, speechHandlers);
let cancelMode = Object.assign({}, speechHandlers);
let repeatMode = Object.assign({}, speechHandlers);
 
module.exports = {
	statelessHandlers : speechHandlers,
	finishModeHandlers : Alexa.CreateStateHandler(constants.states.FINISH_MODE, finishMode),
	cancelModeHandlers : Alexa.CreateStateHandler(constants.states.CANCEL_MODE, cancelMode),
	repeatModeHandlers : Alexa.CreateStateHandler(constants.states.REPEAT_MODE, repeatMode)
};

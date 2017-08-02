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
	this.emit(":askWithCard", 
			constants.speechOutputs.WELCOME_SPEECH + this.attributes.twister.value, 
			constants.reprompts.REPEAT_TWISTER_SPEECH + this.attributes.twister.value,
			constants.cardTitles.LETS_PLAY,
			constants.cards.WELCOME_CARD + this.attributes.twister.value);
};

/** repeats current order */
speechHandlers[constants.speeches.REPEAT_ORDER_SPEECH] = function(){
	console.info('Speech handler ' + constants.speeches.REPEAT_ORDER_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	
};

/** asks if user wants to finish order */
speechHandlers[constants.speeches.FINISH_ORDER_SPEECH] = function(){
	console.info('Speech handler ' + constants.speeches.FINISH_ORDER_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	
			
};

/** incorrect speech handler. informs user and asks if they want to try again */
speechHandlers[constants.speeches.CANCEL_ORDER_SPEECH] = function(){
	console.info('Speech handler ' + constants.speeches.INCORRECT_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	
};

/** tells user they can continue with their order */
speechHandlers[constants.speeches.CONTINUE_ORDER_SPEECH] = function(){
	console.info('Speech handler ' + constants.speeches.CONTINUE_ORDER_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	
	if(this.handler.state !== constants.states.CONTINUE_MODE){
		console.warn('WARNING Speech handler ' + constants.speeches.CONTINUE_SPEECH + ' state mismatch for ' + this.event.session.sessionId + 
				' Expected state: ' + constants.states.CONTINUE_MODE + ' Actual State: ' + this.handler.state);
		this.emitWithState(constants.intents.UNHANDLED_INTENT);
	} else {
		this.emit(":ask", 
				constants.speechOutputs.CONTINUE_SPEECH, 
				constants.reprompts.CONTINUE_SPEECH);
	}
};

/** gives score and says goodbye */
speechHandlers[constants.speeches.GOODBYE_SPEECH] = function(){
	console.log('Speech handler ' + constants.speeches.GOODBYE_SPEECH + ' called for ' + this.event.session.sessionId + " session ending");
	
};

/** notifies user of unrecoverable failure and ends session */
speechHandlers[constants.speeches.FATAL_SPEECH] = function(){
	console.error('ERROR Speech handler ' + constants.speeches.FATAL_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
	
};

/** notifies user of recoverable failure and continues */
speechHandlers[constants.speeches.ERROR_SPEECH] = function(){
	console.error('ERROR Speech handler ' + constants.speeches.ERROR_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
	
};

/** informs user of saved order and exits */
speechHandlers[constants.speeches.ORDER_SAVED_SPEECH] = function(){
	console.log('Speech handler ' + constants.speeches.ORDER_SAVED_SPEECH + ' called for ' + this.event.session.sessionId + " session ending");
	this.emit(":tellWithCard", 
			constants.speechOutputs.WIN_SPEECH, 
			constants.cardTitles.YOU_WIN,
			constants.cards.WIN_CARD);
}

/** gives warning when user tries to save with no products on order and continues */
speechHandlers[constants.speeches.NO_PRODUCTS_SPEECH] = function(){
	console.log('Speech handler ' + constants.speeches.NO_PRODUCTS_SPEECH + ' called for ' + this.event.session.sessionId + " session ending");
	this.emit(":tellWithCard", 
			constants.speechOutputs.WIN_SPEECH, 
			constants.cardTitles.YOU_WIN,
			constants.cards.WIN_CARD);
};

/** gives the user tips and asks if they want to play */
var statelessHelp = function(){
	console.info('Speech handler ' + constants.speeches.HELP_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(':ask',
			constants.speechOutputs.HELP_SPEECH,
			constants.speechOutputs.HELP_SPEECH);
};

/** gives the user tips and asks twister */
var finishModeHelp = function(){
	console.info('Speech handler ' + constants.speeches.HELP_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	
	if(!this.attributes || !this.attributes.twister || !this.attributes.twister.value){
		console.error('ERROR Speech handler ' + constants.speeches.HELP_SPEECH + ' no twister found for ' + this.event.session.sessionId);
		this.emitWithState(constants.speeches.FATAL_SPEECH);
		return;
	} else {
		this.emit(':ask',
				constants.speechOutputs.HELP_GAME_MODE_SPEECH + this.attributes.twister.value,
				constants.reprompts.REPEAT_TWISTER_SPEECH + this.attributes.twister.value);
	}
};

/** gives the user tips and asks if they want to retry the twister */
var cancelModeHelp = function(){
	console.info('Speech handler ' + constants.speeches.HELP_SPEECH + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.emit(':ask',
			constants.speechOutputs.HELP_REPEAT_MODE_SPEECH,
			constants.reprompts.RETRY_SPEECH);
};

/*/** notifies user of recoverable failure and continues 
speechHandlers[constants.speeches.UNHANDLED_SPEECH] = function(){
	console.warn('WARNING Speech handler ' + constants.speeches.UNHANDLED_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
	this.emit(":ask", constants.speechOutputs.UNHANDLED_SPEECH, constants.reprompts.UNHANDLED_SPEECH);
}
/** notifies user of recoverable failure and asks if they want to play */
var statelessUnhandled = function(){
	console.warn('WARNING Speech handler ' + constants.speeches.UNHANDLED_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
	this.emit(":ask", 
			constants.speechOutputs.UNHANDLED_SPEECH + constants.speechOutputs.HELP_SPEECH, 
			constants.reprompts.UNHANDLED_SPEECH + constants.speechOutputs.HELP_SPEECH);
};

/** notifies user of recoverable failure and asks twister */
var finishModeUnhandled = function(){
	if(!this.attributes || !this.attributes.twister || !this.attributes.twister.value){
		console.error('ERROR Speech handler ' + constants.speeches.HELP_SPEECH + ' no twister found for ' + this.event.session.sessionId);
		this.emitWithState(constants.speeches.FATAL_SPEECH);
		return;
	} else {
		console.warn('WARNING Speech handler ' + constants.speeches.UNHANDLED_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
		this.emit(":ask", 
				constants.speechOutputs.UNHANDLED_SPEECH + constants.speechOutputs.HELP_GAME_MODE_SPEECH + this.attributes.twister.value, 
				constants.reprompts.UNHANDLED_SPEECH + constants.speechOutputs.HELP_GAME_MODE_SPEECH + this.attributes.twister.value);
	}
};

/** notifies user of recoverable failure and asks if they want to retry the twister */
var cancelModeUnhandled = function(){
	console.warn('WARNING Speech handler ' + constants.speeches.UNHANDLED_SPEECH + ' called for ' + this.event.session.sessionId + " context " + JSON.stringify(this));
	this.emit(":ask", 
			constants.speechOutputs.UNHANDLED_SPEECH + constants.speechOutputs.HELP_REPEAT_MODE_SPEECH, 
			constants.reprompts.UNHANDLED_SPEECH + constants.speechOutputs.HELP_REPEAT_MODE_SPEECH);
};
 
var finishMode = Object.assign({}, speechHandlers);
var cancelMode = Object.assign({}, speechHandlers);

speechHandlers[constants.speeches.HELP_SPEECH] = statelessHelp;
finishMode[constants.speeches.HELP_SPEECH] = finishModeHelp;
cancelMode[constants.speeches.HELP_SPEECH] = cancelModeHelp;

speechHandlers[constants.speeches.UNHANDLED_SPEECH] = statelessUnhandled;
finishMode[constants.speeches.UNHANDLED_SPEECH] = finishModeUnhandled;
cancelMode[constants.speeches.UNHANDLED_SPEECH] = cancelModeUnhandled;
 
module.exports = {
	statelessHandlers : speechHandlers,
	finishModeHandlers : Alexa.CreateStateHandler(constants.states.FINISH_MODE, finishMode),
	cancelModeHandlers : Alexa.CreateStateHandler(constants.states.CANCEL_MODE, cancelMode)
};
